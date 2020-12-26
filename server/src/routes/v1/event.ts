import { Router, Request, Response } from "express";
import {
  cancelAllJobsOfStudent,
  cancelAllApplicantsForJob,
  fetchFCC,
  parseFilters,
} from "../../helper";
const router = Router();
//@ts-ignore
import { Event, Student, Job, Company, Class } from "../../models";
import { IEvent, IJob, IStudent } from "../../types";
import { eventsSchema } from "../../validations";
import transporter from "../../mail";
//@ts-ignore
import { Op } from "sequelize";

const mailOptions = (
  to: string,
  job: string,
  student: string,
  company: string
) => ({
  from: process.env.EMAIL_USER,
  to: to,
  subject: `You Were Applied For ${company}`,
  text: `Hello ${student},

Your resume was sent to the company "${company}", for the position of "${job}".
Please keep me posted.
  
Good luck!
Hadar.`,
});

router.get("/all", async (req: Request, res: Response) => {
  try {
    const events: IEvent[] = await Event.findAll({
      where: { type: "jobs" },
      include: [
        {
          model: Student,
        },
        {
          model: Job,
        },
      ],
      order: [["date", "DESC"]],
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/allProcesses", async (req: Request, res: Response) => {
  console.log(req.query);
  const cls = JSON.parse(req.query.class ? String(req.query.class) : "{}");
  const process = JSON.parse(
    req.query.process ? String(req.query.process) : "{}"
  );
  console.log(cls);
  console.log(process);
  let clsWhere = {};
  let processWhere = {};

  if (cls.name) {
    clsWhere = { name: { [Op.or]: cls.name } };
  }
  if (process.name)
    [(processWhere = { event_name: { [Op.or]: process.name } })];

  console.log("-----------");
  console.log(clsWhere);
  console.log(processWhere);
  console.log({ type: "jobs", ...processWhere });

  try {
    const events: IEvent[] = await Event.findAll({
      where: { type: "jobs", ...processWhere },
      include: [
        {
          model: Student,
          include: [
            {
              model: Class,
              where: clsWhere,
              required: true,
            },
          ],
          required: true,
        },
        {
          model: Job,
        },
      ],
      order: [["date", "DESC"]],
    });
    const processesData: any[] = [];
    events.forEach((event: any) => {
      if (
        processesData.findIndex(
          (process: any) =>
            process.Student!.id === event.Student!.id &&
            process.Job!.id === event.Job!.id
        ) === -1
      ) {
        processesData.push(event);
      }
    });
    res.json(processesData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/process-options", async (req: Request, res: Response) => {
  const options = {
    classes: [{ name: "All", id: "" }],
    statuses: ["Started application process"],
  };
  const allStatuses: string[] = [
    "Sent CV",
    "Phone Interview",
    "First interview",
    "Second interview",
    "Third Interview",
    "Forth interview",
    "Home Test",
    "Hired",
    "Rejected",
    "Irrelevant",
    "Removed Application",
    "Position Frozen",
    "Canceled",
  ];
  try {
    const allClassesIds: { name: string; id: string }[] = await Class.findAll({
      attributes: ["id", "name"],
    });

    options.classes.push(...allClassesIds);
    options.statuses.push(...allStatuses);

    res.json(options);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.get("/updates", async (req: Request, res: Response) => {
  const result = await fetchFCC();
  res.json(result);
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { relatedId, eventName, userId, entry, date, type } = req.body;
    const { error } = eventsSchema.validate({
      relatedId,
      eventName,
      userId,
      date,
      type,
    });
    if (error) return res.status(400).json({ error: error.message });
    if (eventName === "Hired") {
      const job: IJob = (
        await Job.findByPk(relatedId, {
          include: [{ model: Company, attributes: ["name"] }],
        })
      ).toJSON();
      const student: IStudent = (await Student.findByPk(userId)).toJSON();
      //@ts-ignore
      const studentMsg: string = `Student was hired by ${job.Company.name} as a ${job.position}`;
      // const jobMsg: string = `${student.firstName} ${student.lastName} was hired for this job `;

      cancelAllJobsOfStudent(
        parseInt(userId),
        parseInt(relatedId),
        studentMsg,
        date
      );
      // cancelAllApplicantsForJob(
      //   parseInt(relatedId),
      //   parseInt(userId),
      //   jobMsg,
      //   date
      // );
    } else if (eventName === "Sent CV") {
      const job: IJob = (
        await Job.findByPk(relatedId, {
          include: [{ model: Company, attributes: ["name"] }],
        })
      ).toJSON();
      const student: IStudent = (
        await Student.findByPk(userId, {
          attributes: ["firstName", "lastName", "email"],
        })
      ).toJSON();
      transporter.sendMail(
        mailOptions(
          student.email,
          job.position,
          `${student.firstName} ${student.lastName}`,
          job.Company!.name
        ),
        function (error: Error | null) {
          if (error) {
            console.log(error);
            console.log("Mail not sent");
          }
        }
      );
    }
    const event: IEvent = await Event.create({
      userId,
      relatedId,
      eventName,
      entry,
      date,
      type,
    });
    return res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/delete-process", async (req, res) => {
  // FIX
  try {
    const userId: string = req.body.userId;
    const relatedId = req.body.relatedId;
    const deleted: any = await Event.destroy({
      where: { userId, relatedId },
    });
    if (deleted) return res.json({ message: "Process deleted" });
    return res.status(404).json({ error: "Process not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/delete", async (req, res) => {
  try {
    const eventId: string = req.body.eventId;
    const deleted: any = await Event.destroy({
      where: { id: eventId },
    });
    if (deleted) return res.json({ message: "Event deleted" });
    return res.status(404).json({ error: "Event not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
