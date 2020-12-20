import { Router, Response, Request } from "express";
import {
  //TODO fix
  //@ts-ignore
  Student,
  //@ts-ignore
  Event,
  //@ts-ignore
  Class,
  //@ts-ignore
  User,
  //@ts-ignore
  TeacherofClass,
  //@ts-ignore
} from "../../models";
import { IStudent, PublicFields, PublicFieldsEnum } from "../../types";
import { studentSchema, studentSchemaToPut } from "../../validations";
import transporter from "../../mail";
import generatePassword from "password-generator";
import bcrypt from "bcryptjs";
import { getQuery } from "../../helper";
import { Op } from "sequelize";

// const publicFields: PublicFields[] = ["firstname", "lastname", "fcc"];
const publicFields: string[] = Object.keys(PublicFieldsEnum);

const mailOptions = (to: string, password: string) => ({
  from: process.env.EMAIL_USER,
  to: to,
  subject: "Welcome to CRM",
  text: `You can login with:\nUsername: ${to}\nPassword: ${password}`,
});

const router = Router();

router.get("/byTeacher/:teacherId", async (req: Request, res: Response) => {
  try {
    const teacherId: string = req.params.teacherId;
    const teacherClasses: any | null = await TeacherofClass.findAll({
      include: [{ model: Class, attributes: ["id"], include: [Student] }],
      where: { teacherId },
    });

    if (teacherClasses) {
      return res.json(teacherClasses);
    } else {
      return res.status(404).send("Teacher don`t have classes");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/all", async (req: Request, res: Response) => {
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

router.get("/byId/:id", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const student: IStudent | null = await Student.findByPk(id, getQuery());

    if (student) {
      return res.json(student);
    } else {
      return res.status(404).send("student does not exist");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const body: IStudent = req.body;
    const studentExists = await Student.findOne({
      where: { [Op.or]: [{ idNumber: body.idNumber }, { email: body.email }] },
    });
    if (studentExists) return res.status(409).send("Student already exists");
    const newStudent: IStudent = {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      idNumber: body.idNumber,
      additionalDetails: body.additionalDetails,
      classId: body.classId,
      address: body.address,
      age: body.age,
      maritalStatus: body.maritalStatus,
      children: body.children,
      academicBackground: body.academicBackground,
      militaryService: body.militaryService,
      workExperience: body.workExperience,
      languages: body.languages,
      citizenship: body.citizenship,
      resumeLink: body.resumeLink,
      // fccAccount: body.fccAccount,
    };
    const { value, error } = studentSchema.validate(newStudent);

    if (error) return res.status(400).json(error);
    const student: IStudent = await Student.create(newStudent);
    const password = generatePassword(12, false);

    const hash = bcrypt.hashSync(password, 10);
    const userToCreate = {
      email: body.email,
      relatedId: student.id,
      password: hash,
      type: "student",
    };
    const user = await User.create(userToCreate);
    if (user) {
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

router.patch("/:id", async (req: Request, res: Response) => {
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

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Student.destroy({
      where: { id },
    });
    if (deleted === 0)
      return res.status(404).json({ message: "Student not found" });
    await Event.destroy({ where: { studentId: id } });
    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
