import { Router, Request, Response } from "express";
import {
  cancelAllJobsOfStudent,
  cancelAllApplicantsForJob,
  fetchFCC,
  parseFilters,
} from "../../helper";
const router = Router();
//@ts-ignore
import { Event, Student, Job, Company, Class, sequelize } from "../../models";
import { IEvent, IJob, IStudent, IClass } from "../../types";
import { eventsSchema } from "../../validations";
import transporter from "../../mail";
//@ts-ignore
import { Op, Sequelize, query, QueryTypes } from "sequelize";

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
  const cls = JSON.parse(req.query.class ? String(req.query.class) : "{}");
  const process = JSON.parse(
    req.query.process ? String(req.query.process) : "{}"
  );
  const company = JSON.parse(
    req.query.company ? String(req.query.company) : "{}"
  );
  let clsWhere = {};
  let companyWhere = {};

  if (cls.name) {
    clsWhere = { name: { [Op.or]: cls.name } };
  }
  if (company.name) companyWhere = { name: { [Op.or]: company.name } };

  try {
    interface IStudentWRelationship extends IStudent {
      Class: IClass;
    }
    interface IEventWRelationship extends IEvent {
      Student: IStudentWRelationship;
      Job: IJob;
    }
    const events: IEventWRelationship[] = await Event.findAll({
      where: { type: "jobs" },
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
          include: [
            {
              model: Company,
              attributes: ["name"],
              where: companyWhere,
            },
          ],
          required: true,
        },
      ],
      order: [["date", "DESC"]],
    });
    const processesData: IEventWRelationship[] = [];
    const JobOfStudentWevePast: IEventWRelationship[] = [];
    events.forEach((event: IEventWRelationship) => {
      if (
        JobOfStudentWevePast.findIndex(
          (process: IEventWRelationship) =>
            process.Student.id === event.Student.id &&
            process.Job.id === event.Job!.id
        ) === -1
      ) {
        JobOfStudentWevePast.push(event);
        if (process.name) {
          if (process.name.includes(event.eventName)) {
            processesData.push(event);
          }
        } else processesData.push(event);
      }
    });
    res.json(processesData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/process-options", async (req: Request, res: Response) => {
  interface options {
    classes: { name: string; id: string }[];
    statuses: string[];
    companies: string[];
  }
  try {
    const uniqueClassesQuery = `
    SELECT DISTINCT(Classes.id), Classes.name  FROM Events
    join Students on Events.user_id = Students.id
    join Classes on Students.class_id = Classes.id
    WHERE Events.type = 'jobs'`;
    const classes: { name: string; id: string }[] = await sequelize.query(
      uniqueClassesQuery,
      {
        type: QueryTypes.SELECT,
      }
    );
    const uniqueCompanyQuery = `
    SELECT DISTINCT(Companies.name) FROM Events
    join Jobs on Events.related_id = Jobs.id
    join Companies on Jobs.company_id = Companies.id
    WHERE Events.type = 'jobs'`;
    const companies = await sequelize.query(uniqueCompanyQuery, {
      type: QueryTypes.SELECT,
    });

    const uniqueStatuses = `
    SELECT DISTINCT Events.event_name, Events.related_id, Events.user_id, Events.date FROM Events
    WHERE Events.type = 'jobs'
    order by Events.date , "ASC"`;
    const statuses: { event_name: string }[] = await sequelize.query(
      uniqueStatuses,
      {
        type: QueryTypes.SELECT,
      }
    );

    const statusesToSend: any = [];
    statuses.forEach((status: any) => {
      const index = statusesToSend.findIndex(
        (status2: any) =>
          status2.related_id === status.related_id &&
          status2.user_id === status.user_id
      );
      if (index !== -1 && status.date >= statusesToSend[index].date) {
        statusesToSend.splice(index, 1, status);
      } else {
        statusesToSend.push(status);
      }
    });
    const options: options = {
      classes: [...classes],
      statuses: statusesToSend.map(
        (object: { event_name: string }) => object.event_name
      ),
      companies: companies.map((object: { name: string }) => object.name),
    };

    res.json(options);
  } catch (e) {
    console.log(e.message);
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
