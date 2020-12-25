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
import { ITeacher, PublicFields, PublicFieldsEnum, IEvent } from "../../types";
import { teacherSchema, teacherOfClassSchema } from "../../validations";
import transporter from "../../mail";
import generatePassword from "password-generator";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

const mailOptions = (to: string, password: string) => ({
    from: process.env.EMAIL_USER,
    to: to,
    subject: "Welcome to CRM",
    text: `You can login with:\nUsername: ${to}\nPassword: ${password}`,
  });

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    try {
      const body: ITeacher = req.body;
      const studentExists = await Teacher.findOne({
        where: { [Op.or]: [{ idNumber: body.idNumber }, { email: body.email }] },
      });
      if (studentExists)
        return res.status(409).json({ error: "Student already exists" });
      const newTeacher: ITeacher = {
        idNumber: body.idNumber,
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
      };
      const { value, error } = teacherSchema.validate(newTeacher);
  
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
        transporter.sendMail(
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
            as: 'Classes',
            attributes: ['classId'],
            required:false,
            include: [
                {
                model: Class
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
        if(!req.params.id) return res.status(400).json({error: 'no Id in params'})
        const teacher: ITeacher = await Teacher.findByPk(req.params.id, {
        include: [
            {
            model: TeacherofClass,
            as: 'Classes',
            attributes: ['classId'],
            required:false,
            include: [
                {
                model: Class,
                // include: [
                //     {
                //     model: Lesson,
                //     include: [
                //         {
                //         model: Task,
                //         },
                //     ],
                //     },
                // ],
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

router.post("/addClassToTeacher", async (req: Request, res: Response) => {
    try {
        const {
            teacherWithClass
        } = req.body
        if(!teacherWithClass) return res.status(400).json({error: 'missing teacherWithClass in body'})
        const { value, error } = teacherOfClassSchema.validate(teacherWithClass)
        if (error) return res.status(400).json(error);
        const result = await TeacherofClass.bulkCreate(teacherWithClass)
        res.json(result)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
});
router.post("/RemoveTeacherFromClass", async (req: Request, res: Response) => {
    try {
        const {
            classId,
            teacherId
        } = req.body
        if(!classId || teacherId) return res.status(400).json({error: 'missing query params'})
        const result = await TeacherofClass.destroy({
            where: {classId, teacherId}
        })
        res.json(result)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;