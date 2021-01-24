import { Router, Request, Response } from "express";
import {
  cancelAllJobsOfStudent,
  cancelAllApplicantsForJob,
  fetchFCC,
  parseFilters,
} from "../../helper";
//@ts-ignore
import { Event, Student, Job, Company, Class } from "../../models";
//@ts-ignore
import { Task, TaskofStudent, sequelize } from "../../models";
import { Model } from "sequelize";
import { IEvent, IJob, IStudent, IClass } from "../../types";
import { eventsSchema } from "../../validations";
import { checkToken, validateAdmin, validateTeacher } from "../../middlewares";
import transporter from "../../mail";
//@ts-ignore
import { Op, Sequelize, query, QueryTypes } from "sequelize";

const router = Router();
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
Scale-Up Velocity.`,
});

router.post("/challengeMe", async (req, res) => {
  //todo add validate chllengeme!
  try {
    interface CM {
      eventName: "Submitted Challenge" | "Started Challenge";
      userName: string;
      challengeId: number;
      challengeName: string;
      submissionState?: "FAIL" | "SUCCESS";
      team: string;
    }
    const body: CM = req.body;
    const student = await Student.findOne({
      where: {
        cmUser: body.userName,
      },
      attributes: ["id"],
    });
    if (!student) {
      return res.send("no such student");
    }
    const eventName =
      "CM_" +
      body.eventName
        .toUpperCase()
        .replace(" ", "_")
        .concat(body.submissionState ? "_" + body.submissionState : "");
    const event: IEvent = {
      date: new Date(),
      eventName,
      relatedId: String(body.challengeId),
      type: "challengeMe",
      userId: student.id,
    };
    const { error } = eventsSchema.validate(event);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    const createdEvent = await Event.create(event);
    return res.status(200).send("noice");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.use(checkToken);

router.get("/all/job", validateAdmin, async (req: Request, res: Response) => {
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

router.get(
  "/allProcesses",
  validateAdmin,
  async (req: Request, res: Response) => {
    const cls = JSON.parse(req.query.class ? String(req.query.class) : "{}");
    const process = JSON.parse(
      req.query.process ? String(req.query.process) : "{}"
    );
    const company = JSON.parse(
      req.query.company ? String(req.query.company) : "{}"
    );
    const course = JSON.parse(
      req.query.course ? String(req.query.course) : "{}"
    );
    let clsWhere: { course?: object; name?: object } = {};
    let companyWhere = {};

    if (cls.name) {
      clsWhere = {
        name: { [Op.or]: cls.name },
      };
    }
    if (course.name) {
      clsWhere.course = { [Op.or]: course.name };
    }
    if (company.name) companyWhere = { name: { [Op.or]: company.name } };

    try {
      interface IStudentWRelationship extends IStudent {
        Class: IClass;
      }
      interface dataValues extends IEvent {
        Student: IStudentWRelationship;
        Job: IJob;
      }
      // interface IEventWRelationship {
      //   dataValues:dataValues
      // }
      const events: { dataValues: dataValues }[] = await Event.findAll({
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
        // order: [["date", "ASC"]],
      });
      const processesData: dataValues[] = [];
      const JobOfStudentWevePast: dataValues[] = [];

      for (let i = events.length - 1; i > -1; i--) {
        const event = events[i].dataValues;
        const found = JobOfStudentWevePast.find(
          (process: dataValues) =>
            process.Student.id === event.Student.id &&
            process.Job.id === event.Job!.id
        );
        JobOfStudentWevePast.push(event);
        if (process.name) {
          if (process.name.includes(event.eventName)) {
            if (!found) processesData.push(event);
            else {
              const index = processesData.findIndex(
                (process: dataValues) =>
                  process.Student.id === event.Student.id &&
                  process.Job.id === event.Job!.id
              );
              if (index !== -1 && event.date.getTime() > found.date.getTime()) {
                processesData.splice(index, 1, event);
                JobOfStudentWevePast.splice(index, 1, event);
              } else if (event.date.getTime() > found.date.getTime()) {
                processesData.push(event);
              }
            }
          }
        } else {
          if (!found) processesData.push(event);
          else {
            const index = processesData.findIndex(
              (process: dataValues) =>
                process.Student.id === event.Student.id &&
                process.Job.id === event.Job!.id
            );
            if (
              index !== -1 &&
              event.date.getTime() > processesData[index].date.getTime()
            ) {
              processesData.splice(index, 1, event);
            }
          }
        }
      }
      res.json(processesData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/process-options",
  validateAdmin,
  async (req: Request, res: Response) => {
    interface options {
      classes: { name: string; id: string }[];
      courses: { name: string }[];
      statuses: { name: string }[];
      companies: string[];
    }
    try {
      const uniqueClassesQuery = `
    SELECT DISTINCT Classes.name, Classes.id  FROM Events
    join Students on Events.user_id = Students.id
    join Classes on Students.class_id = Classes.id
    WHERE Events.type = 'jobs'`;
      const classes: { name: string; id: string }[] = await sequelize.query(
        uniqueClassesQuery,
        {
          type: QueryTypes.SELECT,
        }
      );
      const uniqueCoursesQuery = `
    SELECT DISTINCT Classes.course FROM Events
    join Students on Events.user_id = Students.id
    join Classes on Students.class_id = Classes.id
    WHERE Events.type = 'jobs'`;
      const courses: { course: string }[] = await sequelize.query(
        uniqueCoursesQuery,
        {
          type: QueryTypes.SELECT,
        }
      );
      const uniqueCompanyQuery = `
    SELECT DISTINCT Companies.name, Companies.id FROM Events
    join Jobs on Events.related_id = Jobs.id
    join Companies on Jobs.company_id = Companies.id
    WHERE Events.type = 'jobs'`;
      const companies = await sequelize.query(uniqueCompanyQuery, {
        type: QueryTypes.SELECT,
      });

      const uniqueStatuses = `
    SELECT DISTINCT Events.event_name, Events.related_id, Events.user_id, Events.date FROM Events
    WHERE Events.type = 'jobs' and Events.deleted_at IS NULL`;
      // order by Events.date , "ASC"`
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
        if (index !== -1) {
          if (status.date.getTime() >= statusesToSend[index].date.getTime()) {
            statusesToSend.splice(index, 1, status);
          }
        } else {
          statusesToSend.push(status);
        }
      });
      const finalStatuses: { name: string }[] = [];
      statusesToSend.forEach((status: any, i: number) => {
        if (
          !finalStatuses.find(
            (status2: { name: string }) => status2.name === status.event_name
          )
        ) {
          finalStatuses.push({ name: status.event_name });
        }
      });
      const options: options = {
        courses: courses.map((object: { course: string }) => ({
          name: object.course,
        })),
        classes: [...classes],
        statuses: [...finalStatuses],
        companies: companies, //.map((object: { name: string }) => object.name),
      };

      res.json(options);
    } catch (e) {
      console.log(e.message);
      res.status(500).json(e);
    }
  }
);

router.get("/updates", validateTeacher, async (req: Request, res: Response) => {
  try {
    const result = await fetchFCC();
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.post("/", validateAdmin, async (req: Request, res: Response) => {
  try {
    const {
      relatedId,
      eventName,
      userId,
      entry,
      date,
      type,
    }: IEvent = req.body;
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
        Number(userId),
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

router.patch("/delete-process", validateAdmin, async (req, res) => {
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

router.patch("/delete", validateAdmin, async (req, res) => {
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
