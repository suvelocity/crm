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
    const event: IEvent = await Event.create({
      studentId,
      jobId,
      status,
    });
    return res.json(event);
  } catch (err) {
    res.status(500).send("Error occurred");
  }
});

router.delete("/", async (req, res) => {
  try {
    const studentId: string = req.body.studentId;
    const jobId = req.body.jobId;
    const deleted: any = await Event.destroy({
      where: { studentId, jobId },
    });
    if (deleted) return res.json({ msg: "Event deleted" });
    return res.status(404).send("event not found");
  } catch (err) {
    res.status(500).send("Error occurred");
  }
});

module.exports = router;
