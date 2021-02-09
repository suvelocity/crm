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
import transporter from "../../mail";
import generatePassword from "password-generator";
import bcrypt from "bcryptjs";
import { getQuery } from "../../helper";
import { Op, Sequelize, QueryTypes } from "sequelize";
import { validateTeacher, validateAdmin } from "../../middlewares";
import grade from "../../models/grade";
import Joi, { number } from "joi";

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

router.get("/filtered", validateAdmin, async (req: Request, res: Response) => {
  try {
    const query =
      //@ts-ignore
      process.env.NODE_ENV === "test" ? JSON.parse(req.query.test) : req.query;
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
    let orderByScore = [];
    if (AverageScore === "ASC" || AverageScore === "DESC") {
      orderByScore.push([
        Sequelize.fn(
          "ROUND",
          Sequelize.fn("AVG", Sequelize.col("average_score"))
        ),
        AverageScore,
      ]);
    }
    let students = await Student.findAll({
      where: studentWhere,
      include: [
        {
          model: Event,
          where: { type: "jobs" },
          attributes: [],
          required: !isEmpty(JobStatus),
        },
        {
          model: Class,
          attributes: ["id", "name", "course", "cycleNumber"],
          where: classWhere,
        },
        {
          model: AcademicBackground,
          attributes: [
            [
              Sequelize.fn(
                "ROUND",
                Sequelize.fn("AVG", Sequelize.col("average_score"))
              ),
              "gradeAvg",
            ],
            "id",
          ],
        },
      ],
      order: [...orderByScore],
      attributes: [
        "id",
        "firstName",
        "lastName",
        "phone",
        "email",
        "languages",
        "address",
      ],
      group: ["AcademicBackgrounds.student_id"],
      //group: ["Events.related_id", "id", "Events.id", "AcademicBackgrounds.id"],
    });
    if (!isEmpty(JobStatus) && students.length > 0) {
      const { error } = JobStatusValidation.validate(JobStatus);
      if (error)
        return res
          .status(400)
          .json({ error: "job status input failed validation" });
      const eventNames = JobStatus.map((status: string) => `\'${status}\'`);
      const studentIds = students.map(
        (student: any) => `\'${student.toJSON().id}\'`
      );
      const releventStatuses: any = await sequelize.query(
        `
      SELECT a.date, event_name, first_name, a.user_id, a.related_id, a.updated_at, max FROM Students
      join Events a on type = 'jobs' and a.user_id = Students.id 
      join (
      SELECT MAX(date) as max, related_id, user_id from Events
      where type = 'jobs' and deleted_at is null
      group by related_id, user_id
      ) b on a.date = b.max and b.user_id = a.user_id and b.related_id = a.related_id
      where Students.id IN ( ${studentIds} ) and event_name IN ( ${eventNames} );`,
        {
          type: QueryTypes.SELECT,
        }
      );
      const idDictionary = releventStatuses.reduce((acc: any, curr: any) => {
        return { ...acc, [`${curr.user_id}`]: true };
      }, {});
      students = students.filter(
        (student: any) => idDictionary[student.toJSON().id]
      );
    }
    if (!isEmpty(labelIds) && students.length > 0) {
      const studentIds: string[] = students.map(
        (student: { toJSON: () => IStudent }) => String(student.toJSON().id)
      );
      req.query.studentIds = studentIds;
      attachLabels(req, res, students);
    } else {
      res.json({ students: students });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

async function attachLabels(
  req: Request,
  res: Response,
  studentsToSend: { toJSON: () => IStudent }[]
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

router.get("/filter-options", async (req: Request, res: Response) => {
  try {
    const students = await Student.findAll({
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
    });
    const classes = await Class.findAll({
      attributes: ["id", "name"],
    });
    const releventStatuses: any = await sequelize.query(
      `SELECT date, event_name, first_name, a.user_id, a.related_id, max FROM Students
    join Events a on type = 'jobs' and a.user_id = Students.id 
    join (SELECT MAX(date) as max, related_id, user_id from Events
    where type = 'jobs' and deleted_at is null
    group by related_id, user_id) b on a.date = b.max and b.user_id = a.user_id and b.related_id = a.related_id
    group by event_name;`,
      { type: QueryTypes.SELECT }
    );
    const courses: any = await sequelize.query(
      `SELECT CONCAT(course, " - ", cycle_number) as name FROM Classes
       group by CONCAT(course, " - ", cycle_number)
      ;`,
      { type: QueryTypes.SELECT }
    );
    res.json({
      statuses: releventStatuses.map((event: any) => ({
        name: event.event_name,
      })),
      students,
      classes,
      courses,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

    const password = generatePassword(12, false);

    const hash = bcrypt.hashSync(password, 10);
    const userToCreate = {
      email: body.email,
      relatedId: student.id,
      password: hash,
      type: "student",
    };
    const user = await User.create(userToCreate);
    if (user && process.env.NODE_ENV !== "test" && body.createUser) {
      console.log("SENDING MAIL");
      transporter.sendMail(
        mailOptions(body.email, password),
        function (error: Error | null) {
          if (error) {
            console.log(error);
            console.log("Mail not sent");
          }
        }
      );
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id", validateAdmin, async (req: Request, res: Response) => {
  req.body.age = req.body.age === "" ? null : req.body.age;
  req.body.children = req.body.children === "" ? null : req.body.children;
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
