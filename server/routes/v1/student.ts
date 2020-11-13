import { Router, Response, Request } from "express";
import Student, { IStudent } from "../../models/student.model";
import Job from "../../models/job.model";

const router = Router();

router.get("/all", async (req: Request, res: Response) => {
  try {
    const students: IStudent[] = await Student.find({})
      .populate({
        path: "jobs",
        select: ["company", "position", "requirements", "location"],
      })
      .exec();
    res.json(students);
  } catch (err) {
    res.status(500).send("error occurred");
  }
});

router.get("/byId/:id", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const student: IStudent | null = await Student.findById(id)
      .populate({
        path: "jobs",
        select: ["company", "position", "requirements", "location"],
      })
      .exec();
    if (student) {
      return res.json(student);
    } else {
      return res.status(404).send("student does not exist");
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
      additionalDetails: body.additionalDetails,
      class: body.class,
      address: body.address,
      age: body.age,
      jobs: body.jobs,
    });
    const student: IStudent = await newStudent.save();
    res.json(student);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.patch("/modify-jobs/:id", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const jobs = req.body.jobs;
    const method: "add" | "remove" = req.body.method;
    switch (method) {
      case "add":
        const studentWithNewJob: IStudent | null = await Student.findByIdAndUpdate(
          id,
          { $addToSet: { jobs: { $each: jobs } } },
          { new: true }
        ).populate({
          path: "jobs",
          select: ["company", "position", "requirements", "location"],
        });
        if (studentWithNewJob) {
          await Job.updateMany(
            { _id: { $in: jobs } },
            { $addToSet: { students: studentWithNewJob.id } },
            { new: true }
          );
          return res.json(studentWithNewJob);
        } else {
          return res.status(404).send("student does not exist");
        }
      case "remove":
        const studentWithLessJobs: IStudent | null = await Student.findByIdAndUpdate(
          id,
          //@ts-ignore
          { $pull: { jobs: { $in: jobs } } },
          { new: true, multi: true }
        ).populate({
          path: "jobs",
          select: ["company", "position", "requirements", "location"],
        });
        if (studentWithLessJobs) {
          await Job.updateMany(
            { _id: { $in: jobs } },
            { $pull: { students: studentWithLessJobs.id } },
            { new: true }
          );
          return res.json(studentWithLessJobs);
        } else {
          return res.status(404).send("student does not exist");
        }
      default:
        return res.status(404).send("student does not exist");
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
      return res.status(404).send("student does not exist");
    }
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

module.exports = router;
