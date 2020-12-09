import { Router, Request, Response } from "express";
import { stat } from "fs";
import {
  cancelAllJobsOfStudent,
  cancelAllApplicantsForJob,
} from "../../helper";
const router = Router();
//@ts-ignore
import { Event, Student, Job, Company } from "../../models";
import { IEvent, IJob, IStudent } from "../../types";
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
    if (status === "Hired") {
      //TODO fix types
      const job: IJob = (
        await Job.findByPk(jobId, {
          include: [{ model: Company, attributes: ["name"] }],
        })
      ).toJSON();
      const student: IStudent = (await Job.findByPk(studentId)).toJSON();
      console.log(student);
      //@ts-ignore
      const studentMsg: string = `Student was hired by ${job.Company.name} as a ${job.position}`;
      const jobMsg: string = `${student.firstName} ${student.lastName} was hired for this job `;

      cancelAllJobsOfStudent(studentId, jobId, studentMsg, date);
      cancelAllApplicantsForJob(jobId, studentId, jobMsg, date);
    }
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

router.patch("/delete-process", async (req, res) => {
  try {
    const studentId: string = req.body.studentId;
    const jobId = req.body.jobId;
    const deleted: any = await Event.destroy({
      where: { studentId, jobId },
    });
    if (deleted) return res.json({ message: "Process deleted" }).status(204);
    return res.status(404).json({ error: "Process not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/delete", async (req, res) => {
  try {
    const eventId: string = req.body.eventId;
    console.log(req.body);
    const deleted: any = await Event.destroy({
      where: { id: eventId },
    });
    if (deleted) return res.json({ message: "Event deleted" }).status(204);
    return res.status(404).json({ error: "Event not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
