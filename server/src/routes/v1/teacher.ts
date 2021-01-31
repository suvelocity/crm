import { Router, Response, Request } from "express";
import {
  //TODO fix
  //@ts-ignore
  Student,
  //@ts-ignore
  Teacher,
  //@ts-ignore
  Class,
  //@ts-ignore
  User,
  //@ts-ignore
  Task,
  //@ts-ignore
  Lesson,
  //@ts-ignore
  TeacherofClass,
  //@ts-ignore
} from "../../models";
import { ITeacher } from "../../types";
import { teacherSchema, teacherOfClassSchema } from "../../validations";
import { sendMail } from "../../mail";
import generatePassword from "password-generator";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { checkToken, validateAdmin, validateTeacher } from "../../middlewares";

const mailOptions = (to: string, password: string) => ({
  from: process.env.EMAIL_USER,
  to: to,
  subject: "Welcome to Scale-Up Velocity CRM",
  text: `You can login with:\nUsername: ${to}\nPassword: ${password}`,
});

const router = Router();

router.post("/", validateAdmin, async (req: Request, res: Response) => {
  try {
    const body: ITeacher = req.body;
    const teacherExistsInTeachers = await Teacher.findOne({
      where: { [Op.or]: [{ idNumber: body.idNumber }, { email: body.email }] },
    });
    const teacherExistsInUsers = await User.findOne({
      where: { email: body.email },
    });
    if (teacherExistsInTeachers || teacherExistsInUsers)
      return res.status(409).json({ error: "Teacher already exists" });
    const newTeacher: ITeacher = {
      idNumber: body.idNumber,
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
    };
    const { error } = teacherSchema.validate(newTeacher);

    if (error) return res.status(400).json(error);
    const teacher: ITeacher = await Teacher.create(newTeacher);
    const password = generatePassword(12, false);
    const hash = bcrypt.hashSync(password, 10);
    const userToCreate = {
      email: body.email,
      relatedId: teacher.id,
      password: hash,
      type: "teacher",
    };
    const user = await User.create(userToCreate);
    if (user && process.env.NODE_ENV !== "test") {
      console.log("SENDING MAIL");
      sendMail(
        mailOptions(body.email, password),
        function (error: Error | null) {
          if (error) {
            console.log(error.message);
            console.log("Mail not sent");
          }
        }
      );
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/all", async (req: Request, res: Response) => {
  try {
    const teachers: ITeacher[] = await Teacher.findAll({
      include: [
        {
          model: TeacherofClass,
          as: "Classes",
          attributes: ["classId"],
          required: false,
          include: [
            {
              model: Class,
            },
          ],
        },
      ],
    });
    res.json(teachers);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/byId/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id)
      return res.status(400).json({ error: "no Id in params" });
    const teacher: ITeacher = await Teacher.findByPk(req.params.id, {
      include: [
        {
          model: TeacherofClass,
          as: "Classes",
          attributes: ["classId"],
          required: false,
          include: [
            {
              model: Class,
            },
          ],
        },
      ],
    });
    res.json(teacher);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/addClassToTeacher",
  validateAdmin,
  async (req: Request, res: Response) => {
    try {
      const { teacherWithClass } = req.body;
      if (!teacherWithClass)
        return res
          .status(400)
          .json({ error: "missing teacherWithClass in body" });
      const { value, error } = teacherOfClassSchema.validate(teacherWithClass);
      if (error) return res.status(400).json(error);
      const result = await TeacherofClass.bulkCreate(teacherWithClass);
      res.json(result);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: error.message });
    }
  }
);
router.delete(
  "/RemoveTeacherFromClass",
  validateAdmin,
  async (req: Request, res: Response) => {
    try {
      const { classId, teacherId } = req.query;
      if (!classId || !teacherId)
        return res.status(400).json({ error: "missing query params" });
      const result = await TeacherofClass.destroy({
        where: { classId, teacherId },
      });
      res.json(result);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
