import { Router, Request, Response } from "express";
import Job, { IJob } from "../../models/job.model";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const jobs: any[] = await Job.find().populate("students");
    res.json(jobs);
  } catch (e: unknown) {
    //type Error not working
    console.log(e);
    res.status(404).send(e);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const job: IJob | null = await Job.findById(req.params.id).exec();
    res.json(job);
  } catch (e) {
    res.send(e).status(404);
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { body }: { body: IJob } = req;
  try {
    const newJob = new Job({
      company: body.company,
      position: body.position,
      requirements: body.requirements,
      location: body.location,
      students: body.students,
    });

    const savedJob = await newJob.save();
    res.json(savedJob);
  } catch (e: unknown) {
    res.send(e).status(400);
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
    res.json(updated);
  } catch (e) {
    res.send(e).status(404);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deleted: IJob | null = await Job.findByIdAndDelete(
      req.params.id
    ).exec();
    res.json(deleted);
  } catch (e) {
    res.send(e).status(404);
  }
});

module.exports = router;
