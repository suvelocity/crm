import { Router, Response, Request } from "express";
//@ts-ignore
import { Student, Event, AcademicBackground } from "../../models";
//@ts-ignore
import { Class, User, TeacherofClass } from "../../models";
import { IStudent, PublicFields, PublicFieldsEnum } from "../../types";
import { IEvent, IAcademicBackground } from "../../types";
import { studentSchema, studentSchemaToPut } from "../../validations";
import { academicBackgroundSchema } from "../../validations";
import transporter from "../../mail";
import generatePassword from "password-generator";
import bcrypt from "bcryptjs";
import { getQuery } from "../../helper";
import { Op } from "sequelize";
import { validateTeacher, validateAdmin } from "../../middlewares";

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
    if (user && process.env.NODE_ENV !== "test") {
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
      if (academic.id === undefined) {
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
