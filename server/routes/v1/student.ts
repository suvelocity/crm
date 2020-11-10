import { Router, Response, Request } from "express";
import Student, { IStudent } from "../../models/student.model";
import Job from "../../models/job.model";

const router = Router();
router.get("/all", async (req: Request, res: Response) => {
  try {
    const students: IStudent[] = await Student.find({}).populate("jobs").exec();
    res.json(students);
  } catch (err) {
    res.status(500).send("error occurred");
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const student: IStudent | null = await Student.findByIdAndRemove(id);
    if (student) {
      return res.json(student);
    } else {
      return res.status(400).send("student not exist");
    }
  } catch (err) {
    res.status(500).send("student not exist");
  }
});

router.get("/byId/:id", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const student: IStudent | null = await Student.findById(id)
      .populate("jobs")
      .exec();
    if (student) {
      return res.json(student);
    } else {
      return res.status(400).send("student not exist");
    }
  } catch (err) {
    res.status(500).send("error occurred");
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const jobs = req.body.jobs;
    const method: "add" | "delete" = req.body.method;
    switch (method) {
      case "add":
        const studentWithNewJob: IStudent | null = await Student.findByIdAndUpdate(
          id,
          { $addToSet: { jobs: { $each: jobs } } },
          { new: true }
        ).populate("jobs");
        if (studentWithNewJob) {
          await Job.updateMany(
            { _id: { $in: jobs } },
            { $addToSet: { students: studentWithNewJob._id } },
            { new: true }
          );
          return res.json(studentWithNewJob);
        } else {
          return res.status(400).send("student not exist");
        }
      case "delete":
        const studentWithLessJobs: IStudent | null = await Student.findByIdAndUpdate(
          id,
          //@ts-ignore
          { $pull: { jobs: { $in: jobs } } },
          { new: true, multi: true }
        ).populate("jobs");
        if (studentWithLessJobs) {
          await Job.updateMany(
            { _id: { $in: jobs } },
            { $pull: { students: studentWithLessJobs._id } },
            { new: true }
          );
          return res.json(studentWithLessJobs);
        } else {
          return res.status(400).send("student not exist");
        }
      default:
        return res.status(400).send("student not exist");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    const student: IStudent | null = await Student.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).exec();
    if (student) {
      return res.json(student);
    } else {
      return res.status(400).send("student not exist");
    }
  } catch (err) {
    res.status(500).send("error occurred");
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const body: Partial<IStudent> = req.body;
    const newStudent: IStudent = new Student({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      idNumber: body.idNumber,
      description: body.description,
      class: body.class,
      address: body.address,
      jobs: body.jobs,
    });
    const student: IStudent = await newStudent.save();
    res.json(student);
  } catch (err) {
    res.status(500).send("error occurred");
  }
});

module.exports = router;
