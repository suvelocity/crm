import { Router, Response, Request } from "express";
import { where } from "sequelize/types";
//@ts-ignore
import { Student, Job, Event, Class } from "../../models";
import { IStudent, IJob } from "../../types";
const router = Router();

router.get("/all", async (req: Request, res: Response) => {
  try {
    const students: IStudent[] = await Student.findAll({
      include: [
        {
          model: Event,
          include: [
            {
              model: Job,
            },
          ],
          attributes: ["status", "createdAt"],
        },
      ],
    });
    res.json(students);
  } catch (err) {
    res.status(500).send("error occurred");
  }
});

router.get("/byId/:id", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const student: IStudent | null = await Student.findByPk(id, {
      include: [
        {
          model: Event,
          include: [
            {
              model: Job,
            },
          ],
          attributes: ["status", "createdAt"],
        },
      ],
    });
    if (student) {
      return res.json(student);
    } else {
      return res.status(400).send("student does not exist");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const body: IStudent = req.body;
    const studentExists = await Student.findOne({
      where: { idNumber: body.idNumber },
    });
    if (studentExists) return res.status(400).send("Student already exists");
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
    };
    const student: IStudent = await Student.create(newStudent);
    res.json(student);
  } catch (err) {
    res.status(500).send("error occurred");
  }
});

router.patch("/modify-jobs/:id", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const jobId = req.body.jobId;
    const status = req.body.status;
    const method: "add" | "remove" = req.body.method;
    switch (method) {
      case "add":
        const event: any = await Event.create({
          studentId: id,
          jobId,
          status,
        });
        return res.json(event);

      case "remove":
        const studentWithLessJobs: any = await Event.destroy({
          where: { studentId: id, jobId },
        });
        if (studentWithLessJobs) return res.json({ msg: "Event deleted" });
        return res.status(400).send("event not found");

      default:
        return res.status(400).send("No method included");
    }
  } catch (err) {
    res.status(500).send("Error occurred");
  }
});

// router.put("/:id", async (req: Request, res: Response) => {
//   try {
//     const id: string = req.params.id;

//     const student: IStudent | null = await Student.findByIdAndUpdate(
//       id,
//       req.body,
//       { new: true }
//     ).exec();
//     if (student) {
//       return res.json(student);
//     } else {
//       return res.status(404).send("student does not exist");
//     }
//   } catch (err) {
//     res.status(500).send("error occurred");
//   }
// });

// router.delete("/:id", async (req: Request, res: Response) => {
//   try {
//     const id: string = req.params.id;
//     const student: IStudent | null = await Student.findByIdAndRemove(id);
//     if (student) {
//       return res.json(student);
//     } else {
//       return res.status(400).send("student not exist");
//     }
//   } catch (err) {
//     res.status(500).send("student not exist");
//   }
// });

module.exports = router;
