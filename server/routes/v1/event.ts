import { Router, Request, Response } from "express";
const router = Router();
//@ts-ignore
import { Event, Student, Job } from "../../models";
import { IEvent } from "../../types";
import { eventsSchema } from "../../validations";

router.get("/all", async (req: Request, res: Response) => {
  try {
    const events: IEvent[] = await Event.findAll({
      include: [
        {
          model: Student,
        },
        {
          model: Job,
        },
      ],
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { jobId, status, studentId, comment, date } = req.body;
    const { error } = eventsSchema.validate({
      jobId,
      status,
      studentId,
      comment,
      date,
    });
    if (error) return res.status(400).json({ error: error.message });
    const event: IEvent = await Event.create({
      studentId,
      jobId,
      status,
      comment,
      date,
    });
    return res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/delete", async (req, res) => {
  try {
    const studentId: string = req.body.studentId;
    const jobId = req.body.jobId;
    const deleted: any = await Event.destroy({
      where: { studentId, jobId },
    });
    if (deleted) return res.json({ message: "Event deleted" });
    return res.status(404).json({ error: "Event not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
