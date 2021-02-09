import { Router, Response, Request } from "express";
//@ts-ignore
import db, { Student, Event, AcademicBackground } from "../../models";
//@ts-ignore
import { TeacherofClass, Grade, Label, Criterion, Job } from "../../models";
//@ts-ignore
import { Class, User, TaskLabel, sequelize } from "../../models";
import { IStudent, PublicFields, PublicFieldsEnum } from "../../types";
import { LabelIdsWithGradesPerStudent, gradeObj } from "../../types";
import { LabelIdsWithGrades, studentGrades } from "../../types";
import { IEvent, IAcademicBackground } from "../../types";
import {
  studentSchema,
  studentSchemaToPut,
  JobStatusValidation,
} from "../../validations";
import { academicBackgroundSchema } from "../../validations";
import { sendMail } from "../../mail";
import generatePassword from "password-generator";
import bcrypt from "bcryptjs";
import { getQuery } from "../../helper";
import { Op, Sequelize, QueryTypes } from "sequelize";
import { validateTeacher, validateAdmin } from "../../middlewares";
import grade from "../../models/grade";
import Joi, { number } from "joi";
import student from "../../models/student";

// const publicFields: PublicFields[] = ["firstname", "lastname", "fcc"];
const publicFields: string[] = Object.keys(PublicFieldsEnum);

const mailOptions = (to: string, password: string) => ({
  from: process.env.EMAIL_USER,
  to: to,
  subject: "Welcome to Scale-Up Velocity CRM",
  text: `You can login with:\nUsername: ${to}\nPassword: ${password}`,
});

const router = Router();

router.get(
  "/byTeacher/:teacherId",
  validateTeacher,
  async (req: Request, res: Response) => {
    try {
      const teacherId: string = req.params.teacherId;
      const teacherClasses: any | null = await TeacherofClass.findAll({
        include: [
          { model: Class, attributes: ["id", "name"], include: [Student] },
        ],
        where: { teacherId },
      });

      if (teacherClasses) {
        return res.json(teacherClasses);
      } else {
        return res.status(404).json({ error: "Teacher don`t have classes" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
);

router.get("/all", validateAdmin, async (req: Request, res: Response) => {
  //@ts-ignore
  const fields: string[] = req.query.fields?.split(",");
  const onlyActive: boolean = Boolean(req.query.onlyactive);
  const omitRelations: boolean = Boolean(req.query.omitrelations);

  //@ts-ignore
  const filteredFields: PublicFields[] = fields?.filter((field: string) =>
    publicFields.includes(field)
  );

  try {
    const query = getQuery(filteredFields, omitRelations, onlyActive);
    const students: IStudent[] = await Student.findAll(query);
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get(
  "/filtered",
  validateTeacher,
  async (req: Request, res: Response) => {
    try {
      const query =
        process.env.NODE_ENV === "test"
          ? //@ts-ignore
            JSON.parse(req.query.test)
          : req.query;
      console.log("QUERY ", query);
      const {
        JobStatus,
        Course,
        Class: ClassIds,
        Name,
        labelIds,
        Languages,
        AverageScore,
        addressName,
      }: { [key: string]: any } = query;
      const isEmpty = (property: any) => {
        if (!property) return true;
        return property[0] === "";
      };
      const OPor = (arr: string[], attr: string, obj: any) => {
        if (!isEmpty(arr)) obj[attr] = { [Op.or]: arr };
      };
      let classWhere: any = {};
      const studentWhere: any = {};
      if (!isEmpty(Languages)) {
        studentWhere.languages = {
          [Op.or]: Languages.map((lang: string) => ({
            [Op.like]: "%" + lang + "%",
          })),
        };
      }
      if (addressName) {
        studentWhere.address = { [Op.like]: "%" + addressName + "%" };
      }
      if (!isEmpty(Course)) {
        const array: any = [];
        Course.forEach((val: string) => {
          const [course, cycleNumber] = val.split(" - ");
          array.push({ [Op.and]: [{ course }, { cycleNumber }] });
        });
        classWhere = { [Op.or]: array };
      }
      OPor(ClassIds, "id", classWhere);
      OPor(Name, "id", studentWhere);
      let students = await Student.findAll({
        where: studentWhere,
        include: [
          {
            model: Event,
            where: { type: "jobs" },
            attributes: ["date", "updatedAt", "eventName", "relatedId"],
            required: false, //!isEmpty(JobStatus),
          },
          {
            model: Class,
            attributes: ["id", "name", "course", "cycleNumber"],
            where: classWhere,
          },
          {
            model: AcademicBackground,
            attributes: ["averageScore", "id"],
            require: false,
          },
        ],
        // order: [...orderByScore],
        attributes: [
          "id",
          "firstName",
          "lastName",
          "phone",
          "email",
          "languages",
          "address",
        ],
      });

      let studentsWithGradeAvg: IStudent[] = students.map(
        (student: { toJSON: () => IStudent }) => {
          const studentJson = student.toJSON();
          return {
            ...studentJson,
            gradeAvg: getGradeAverage(studentJson.AcademicBackgrounds!),
          };
        }
      );

      if (AverageScore === "ASC" || AverageScore === "DESC") {
        studentsWithGradeAvg.sort((a: IStudent, b: IStudent) =>
          AverageScore === "ASC"
            ? a.gradeAvg! - b.gradeAvg!
            : b.gradeAvg! - a.gradeAvg!
        );
      }

      if (!isEmpty(JobStatus) && students.length > 0) {
        const { error } = JobStatusValidation.validate(JobStatus);
        if (error)
          return res
            .status(400)
            .json({ error: "job status input failed validation" });
        studentsWithGradeAvg = studentsWithGradeAvg.filter(
          (student: IStudent) => {
            const releventStatuses = getRecentJobsStatuses(student.Events!);
            if (
              JobStatus.includes("None") &&
              (student.Events!.length == 0 ||
                releventStatuses.every(
                  (status: string) => status === "Rejected"
                ))
            ) {
              return true;
            }
            console.log("checking statuses");
            return JobStatus.some((status: string) =>
              releventStatuses.includes(status)
            );
          }
        );
      }

      if (!isEmpty(labelIds) && students.length > 0) {
        const studentIds: string[] = studentsWithGradeAvg.map(
          (student: IStudent) => String(student.id)
        );
        req.query.studentIds = studentIds;
        attachLabels(req, res, studentsWithGradeAvg);
      } else {
        res.json({ students: studentsWithGradeAvg });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

const getRecentJobsStatuses = (events: IEvent[]): string[] => {
  type JobEvents = {
    [id: string]: { time: number; status: string; updatedAt: number };
  };
  let jobs: JobEvents = {};
  for (let i = 0; i < events.length; i++) {
    const id: string = events[i].relatedId;
    const eventTime = new Date(events[i].date);
    const updatedAt = new Date(events[i].updatedAt!).getTime();
    if (!jobs[`job${id}`]) {
      jobs[`job${id}`] = {
        time: eventTime.getTime(),
        status: events[i].eventName,
        updatedAt: updatedAt,
      };
    } else if (
      eventTime.getTime() > jobs[`job${id}`].time ||
      (eventTime.getTime() === jobs[`job${id}`].time &&
        updatedAt > jobs[`job${id}`].updatedAt)
    ) {
      jobs[`job${id}`] = {
        time: eventTime.getTime(),
        status: events[i].eventName,
        updatedAt: updatedAt,
      };
    }
  }
  let JobStatuses: { [status: string]: string } = {};
  for (const key in jobs) {
    if (!JobStatuses[jobs[key].status])
      JobStatuses[jobs[key].status] = jobs[key].status;
  }
  return Object.keys(JobStatuses);
};

const getGradeAverage = (
  AcademicBackgrounds: IAcademicBackground[]
): number => {
  let gradeSum = 0;
  let length = 0;
  AcademicBackgrounds.forEach((AcademicBackgrounds: IAcademicBackground) => {
    gradeSum += AcademicBackgrounds.averageScore;
    length++;
  });
  if (length === 0) return 0;
  return Math.round(gradeSum / length);
};

async function attachLabels(
  req: Request,
  res: Response,
  studentsToSend: IStudent[]
): Promise<Response<any> | undefined> {
  try {
    const { labelIds, studentIds } = req.query;
    const labelGradeArr: {
      toJSON: () => LabelIdsWithGrades;
    }[] = await TaskLabel.findAll({
      where: { labelId: { [Op.or]: labelIds } },
      attributes: ["labelId"],
      include: [
        {
          model: Grade,
          where: { belongsTo: "label", studentId: { [Op.or]: studentIds } },
          attributes: ["grade", "studentId"],
          required: false,
        },
        {
          model: Criterion,
          attributes: ["id"],
          include: [
            {
              model: Grade,
              where: {
                belongsTo: "criterion",
                studentId: { [Op.or]: studentIds },
              },
              attributes: ["grade", "studentId"],
            },
          ],
        },
      ],
    });
    const labelGradesPerStudent: LabelIdsWithGradesPerStudent = {};
    labelGradeArr.map((gradeObj: { toJSON: () => LabelIdsWithGrades }) => {
      const jsonObj = gradeObj.toJSON();
      let labelInObj = labelGradesPerStudent[jsonObj.labelId];
      if (!labelInObj) {
        labelGradesPerStudent[jsonObj.labelId] = {};
        labelInObj = labelGradesPerStudent[jsonObj.labelId];
      }
      jsonObj.Grades.forEach((grade: gradeObj) => {
        let studentGrades = labelInObj[grade.studentId];
        if (!studentGrades) {
          labelInObj[grade.studentId] = {
            sum: grade.grade,
            count: 1,
          };
        } else {
          studentGrades.count++;
          studentGrades.sum += grade.grade;
        }
      });
      const criteriaGradesToAdd: { [studentId: string]: studentGrades } = {};
      jsonObj.Criteria.forEach((Criteria: { Grades: gradeObj[] }) => {
        Criteria.Grades.forEach((grade: gradeObj) => {
          let student = criteriaGradesToAdd[grade.studentId];
          if (!student) {
            criteriaGradesToAdd[grade.studentId] = {
              sum: grade.grade,
              count: 1,
            };
          } else {
            student.sum += grade.grade;
            student.count++;
          }
        });
      });
      for (const key in criteriaGradesToAdd) {
        const gradeToAdd =
          criteriaGradesToAdd[key].sum / criteriaGradesToAdd[key].count;
        let studentInLabel = labelInObj[key];
        if (!studentInLabel) {
          labelInObj[key] = {
            sum: gradeToAdd,
            count: 1,
          };
        } else {
          studentInLabel.sum += gradeToAdd;
          studentInLabel.count++;
        }
      }
    });
    res.json({ students: studentsToSend, gradedLabels: labelGradesPerStudent });
  } catch (error) {
    res.json({ students: studentsToSend });
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
}

router.get(
  "/filter-options",
  validateTeacher,
  async (req: Request, res: Response) => {
    try {
      const classIds = req.query.classIds;
      console.log(classIds, "filter options");
      const students = await Student.findAll({
        where: !classIds ? {} : { classId: { [Op.or]: classIds } },
        attributes: [
          "id",
          [
            Sequelize.fn(
              "concat",
              Sequelize.col("first_name"),
              " ",
              Sequelize.col("last_name")
            ),
            "name",
          ],
        ],
        include: [
          {
            model: Event,
            required: false,
          },
        ],
      });
      const classes = await Class.findAll({
        attributes: ["id", "name"],
      });
      //   const releventStatuses: any = await sequelize.query(
      //     `SELECT date, event_name, first_name, a.user_id, a.related_id, max FROM Students
      // join Events a on type = 'jobs' and a.user_id = Students.id
      // join (SELECT MAX(date) as max, related_id, user_id from Events
      // where type = 'jobs' and deleted_at is null
      // group by related_id, user_id) b on a.date = b.max and b.user_id = a.user_id and b.related_id = a.related_id
      // group by event_name;`,
      //     { type: QueryTypes.SELECT }
      //   );
      const courses: any = await sequelize.query(
        `SELECT CONCAT(course, " - ", cycle_number) as name FROM Classes
       group by CONCAT(course, " - ", cycle_number)
      ;`,
        { type: QueryTypes.SELECT }
      );
      const releventStatuses: { [key: string]: boolean } = {};
      students.forEach((student: { toJSON: () => IStudent }) => {
        const jsonStudent = student.toJSON();
        const recentStatuses = getRecentJobsStatuses(jsonStudent.Events!);
        recentStatuses.forEach(
          (status: string) => (releventStatuses[status] = true)
        );
      });
      res.json({
        statuses: Object.keys(releventStatuses).map((event: string) => ({
          name: event,
        })),
        students,
        classes,
        courses,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

router.get("/byId/:id", validateAdmin, async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const only = req.query.only;

    const student: any | null = await Student.findByPk(
      id,
      getQuery(undefined, false, false, only as string | undefined)
    );

    if (student) {
      // student.Events = student.Events.filter((event: any, i:number) =>event.dataValues.type ==='job');
      return res.json(student);
    } else {
      return res.status(404).json({ error: "student does not exist" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", validateAdmin, async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const studentExistsInStudents = await Student.findOne({
      where: { [Op.or]: [{ idNumber: body.idNumber }, { email: body.email }] },
    });
    const studentExistsInUsers = await User.findOne({
      where: { email: body.email },
    });
    if (studentExistsInStudents || studentExistsInUsers)
      return res.status(409).json({ error: "Student already exists" });
    const AcademicBackgrounds = req.body.AcademicBackgrounds as
      | IAcademicBackground[]
      | undefined;

    const newStudent: IStudent = {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      idNumber: body.idNumber,
      additionalDetails: body.additionalDetails,
      classId: body.classId,
      address: body.address,
      age: body.age === "" ? null : body.age,
      maritalStatus: body.maritalStatus,
      children: body.children ? null : body.children,
      militaryService: body.militaryService,
      workExperience: body.workExperience,
      languages: body.languages,
      citizenship: body.citizenship,
      resumeLink: body.resumeLink,
      fccAccount: body.fccAccount,
    };
    const { value, error } = studentSchema.validate(newStudent);

    if (error) return res.status(400).json(error);
    const student: IStudent = await Student.create(newStudent);
    if (AcademicBackgrounds && student.id) {
      const { value, error } = academicBackgroundSchema.validate(
        AcademicBackgrounds
      );
      if (error) return res.status(400).json(error);
      const academicBackgroundToCreate = AcademicBackgrounds.map(
        (background) => ({ ...background, studentId: student.id })
      );
      await AcademicBackground.bulkCreate(academicBackgroundToCreate);
    }

    if (body.createUser) {
      const password = generatePassword(12, false);

      const hash = bcrypt.hashSync(password, 10);
      const userToCreate = {
        email: body.email,
        relatedId: student.id,
        password: hash,
        type: "student",
      };
      const user = await User.create(userToCreate);
      if (user && process.env.NODE_ENV !== "test") {
        console.log("SENDING MAIL");
        sendMail(
          mailOptions(body.email, password),
          function (error: Error | null) {
            if (error) {
              console.log(error);
              console.log("Mail not sent");
            }
          }
        );
      }
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/ByEmail", async (req, res) => {
  let query: any = {};
  if (req.query.validId) {
    query.id = { [Op.not]: [req.query.validId] };
  }
  if (!req.query.email)
    return res.status(400).json({ error: "email not supplied" });
  query.email = req.query.email;
  const studentWithSameEmail = await Student.findOne({
    where: query,
  });
  if (studentWithSameEmail) return res.json({ available: false });
  res.json({ available: true });
});

router.patch("/:id", validateAdmin, async (req: Request, res: Response) => {
  req.body.age = req.body.age === "" ? null : req.body.age;
  req.body.children = req.body.children === "" ? null : req.body.children;
  if (!req.params.id) return res.json({ error: "no id provided in params" });
  if (req.body.AcademicBackgrounds) {
    const academicBackgrounds = [...req.body.AcademicBackgrounds];
    for (let i = 0; i < academicBackgrounds.length; i++) {
      const academic = academicBackgrounds[i];
      if (typeof academic.id === "string") {
        delete academic.id;
        await AcademicBackground.create({
          ...academic,
          studentId: req.params.id,
        });
      } else {
        await AcademicBackground.update(academic, {
          where: { id: academic.id },
        });
      }
    }
    delete req.body.AcademicBackgrounds;
  }
  const { error } = studentSchemaToPut.validate(req.body);
  if (error) return res.status(400).json(error);
  try {
    if (req.body.email) {
      const studentWithSameEmail = await Student.findOne({
        where: { email: req.body.email, id: { [Op.not]: [req.params.id] } },
      });
      if (studentWithSameEmail) {
        return res
          .status(400)
          .json({ error: "Email already exists for other student" });
      }
      await User.update(
        { email: req.body.email },
        {
          where: { relatedId: req.params.id },
        }
      );
    }
    const updated = await Student.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated[0] === 1) return res.json({ message: "Student updated" });
    res.status(404).json({ error: "Student not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/academicBackground/:id", async (req, res) => {
  const { id } = req.params;
  const { studentId } = req.query;
  if (!id || !studentId)
    return res.status(404).json({ error: "no id or studentId in params" });
  await AcademicBackground.destroy({ where: { id } });
  const studentsAcademicBackgrounds = await AcademicBackground.findAll({
    where: { studentId: studentId },
  });
  return res.json(studentsAcademicBackgrounds);
});

router.delete("/:id", validateAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Student.destroy({
      where: { id },
    });
    if (deleted === 0)
      return res.status(404).json({ message: "Student not found" });
    await Event.destroy({ where: { userId: id, type: "student" } });
    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
