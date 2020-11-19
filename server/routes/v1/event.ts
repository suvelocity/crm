import { Router, Request, Response } from "express";
const router = Router();
//@ts-ignore
import { Event } from "../../models";
import { IEvent } from "../../types";

router.post("/", async (req: Request, res: Response) => {
  try {
    const studentId: string = req.body.studentId;
    const jobId = req.body.jobId;
    const status = req.body.status;
    const method: "add" | "remove" = req.body.method;
    switch (method) {
      case "add":
        const event: IEvent = await Event.create({
          studentId,
          jobId,
          status,
        });
        return res.json(event);

      case "remove":
        const studentWithLessJobs: any = await Event.destroy({
          where: { studentId, jobId },
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

module.exports = router;
