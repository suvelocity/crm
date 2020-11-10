import { Router, Request, Response } from "express";
import Job, { IJob } from "../../models/job.model";
import Student from "../../models/student.model";

const router = Router();

router.get("/all", async (req: Request, res: Response) => {
  try {
    const jobs: IJob[] = await Job.find().populate({
      path: "students",
      select: [
        "email",
        "firstName",
        "lastName",
        "idNumber",
        "phone",
        "description",
        "class",
        "age",
        "address",
      ],
    });

    if (jobs) {
      res.json(jobs);
    } else {
      return res.status(404).send("job does not exist");
    }
  } catch (e: unknown) {
    //type Error not working
    res.send(e).status(500);
  }
});

router.get("/byId/:id", async (req: Request, res: Response) => {
  try {
    const job: IJob | null = await Job.findById(req.params.id)
      .populate({
        path: "students",
        select: [
          "email",
          "firstName",
          "lastName",
          "idNumber",
          "phone",
          "description",
          "class",
          "age",
          "address",
        ],
      })
      .exec();
    if (job) {
      return res.json(job);
    } else {
      return res.status(404).send("job does not exist");
    }
  } catch (e) {
    res.send(e).status(500);
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { body }: { body: IJob } = req;
  try {
    const newJob: IJob = new Job({
      company: body.company,
      position: body.position,
      requirements: body.requirements,
      location: body.location,
      students: body.students,
    });

    const savedJob: IJob = await newJob.save();
    res.json(savedJob);
  } catch (e: unknown) {
    res.send(e).status(400);
  }
});

router.patch("/modify-students/:id", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const students = req.body.students;
    const method: "add" | "remove" = req.body.method;
    switch (method) {
      case "add":
        const jobWithNewStudent: IJob | null = await Job.findByIdAndUpdate(
          id,
          { $addToSet: { students: { $each: students } } },
          { new: true }
        ).populate({
          path: "students",
          select: [
            "email",
            "firstName",
            "lastName",
            "idNumber",
            "phone",
            "description",
            "class",
            "age",
            "address",
          ],
        });
        if (jobWithNewStudent) {
          await Student.updateMany(
            { _id: { $in: students } },
            { $addToSet: { jobs: jobWithNewStudent.id } },
            { new: true }
          );
          return res.json(jobWithNewStudent);
        } else {
          return res.status(404).send("job does not exist");
        }
      case "remove":
        const jobWithLessStudents: IJob | null = await Job.findByIdAndUpdate(
          id,
          //@ts-ignore
          { $pull: { students: { $in: students } } },
          { new: true, multi: true }
        ).populate({
          path: "students",
          select: [
            "email",
            "firstName",
            "lastName",
            "idNumber",
            "phone",
            "description",
            "class",
            "age",
            "address",
          ],
        });
        if (jobWithLessStudents) {
          await Student.updateMany(
            { _id: { $in: students } },
            { $pull: { jobs: jobWithLessStudents.id } },
            { new: true }
          );
          return res.json(jobWithLessStudents);
        } else {
          return res.status(404).send("job does not exist");
        }
      default:
        return res.status(404).send("job does not exist");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const toUpdate: Partial<IJob> = req.body;

  try {
    const updated: IJob | null = await Job.findByIdAndUpdate(
      req.params.id,
      toUpdate,
      { new: true }
    ).exec();
    if (updated) {
      res.json(updated);
    } else {
      return res.status(404).send("job does not exist");
    }
  } catch (e) {
    res.send(e).status(500);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deleted: IJob | null = await Job.findByIdAndDelete(
      req.params.id
    ).exec();

    if (deleted) {
      res.json(deleted);
    } else {
      return res.status(404).send("job does not exist");
    }
  } catch (e) {
    res.send(e).status(500);
  }
});

module.exports = router;
