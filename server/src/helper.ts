require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import axios from "axios";
import {
  IEvent,
  IFccEvent,
  IJob,
  IStudent,
  ITaskFilter,
  ITaskofStudent,
  PublicFields,
  PublicFieldsEnum,
  SeqInclude,
} from "./types";
//@ts-ignore
import { Student, Company, Job, Event } from "./models";
//@ts-ignore
import { Class, TaskOfStudent, Task } from "./models";
import { Op } from "sequelize";
import { flatMap, flatten, orderBy, reduce } from "lodash";
import { parse } from "dotenv/types";
import { object } from "joi";
//TODO fix types
export const cancelAllJobsOfStudent: (
  studentId: number,
  hiredJobId: number,
  comment: string,
  date: Date
) => Promise<void> = async (
  studentId: number,
  hiredJobId: number,
  comment: string,
  date: Date
) => {
  try {
    const studentData: IStudent | null = await Student.findByPk(studentId, {
      include: [
        {
          model: Event,
          attributes: ["relatedId"],
        },
      ],
      attributes: ["firstName", "lastName", "idNumber", "id"],
    });

    if (!studentData) return;
    const jobIds: number[] = getUnique(
      //@ts-ignore
      studentData.Events.map((event: IEvent) => event.relatedId),
      [hiredJobId]
    );
    await Promise.all(
      jobIds.map((relatedId: number) =>
        Event.create({
          comment,
          date,
          userId: studentId,
          relatedId,
          type: "jobs",
          eventName: "Canceled",
          entry: { comment },
        })
      )
    );
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const cancelAllApplicantsForJob: (
  jobId: number,
  hiredStudentId: number,
  comment: string,
  date: Date
) => Promise<void> = async (
  jobId: number,
  hiredStudentId: number,
  comment: string,
  date: Date
) => {
  try {
    const jobData: IJob | null = await Job.findByPk(jobId, {
      include: [
        {
          model: Event,
          attributes: ["userId"],
        },
      ],
    });

    if (!jobData) return;

    const studentsIds = getUnique(
      //@ts-ignore
      jobData.Events.map((event: IEvent) => event.userId),
      [hiredStudentId]
    );

    await Promise.all(
      studentsIds.map((userId: number) =>
        Event.create({
          date,
          userId,
          relatedId: jobId,
          type: "jobs",
          // date: new Date().setHours(0, 0, 0, 0),
          eventName: "Canceled",
          entry: { comment },
        })
      )
    );
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getUnique: (array: number[], exclude: number[]) => number[] = (
  array: number[],
  exclude: number[]
) => {
  //@ts-ignore
  return array.filter(
    (elem: number, i: number) =>
      !exclude.includes(Number(elem)) && array.indexOf(elem) === i
  );
};

export function checkToken(req: Request, res: Response, next: NextFunction) {
  let token: string | undefined | string[] = req.headers.authorization;
  if (!token || Array.isArray(token))
    return res.status(400).json({ error: "No token sent" });
  token = token.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET!,
    (err: Error | null, decoded: any) => {
      //TODO change
      if (err) {
        return res.status(403).json({ error: err });
      }
      //@ts-ignore
      req.user = decoded;
      //TODO change
      next();
    }
  );
}

//TODO add inteface for query
export const getQuery: (
  specificFields?: PublicFields[],
  omitRelations?: boolean,
  onlyActive?: boolean,
  only?: string | undefined
) => any = (
  specificFields: string[] | undefined = undefined,
  omitRelations: boolean = false,
  onlyActive: boolean = false,
  only: string | undefined
) => {
  const include: SeqInclude[] = [
    {
      model: Class,
    },
  ];

  if (onlyActive) {
    include[0].where = { ending_date: { [Op.gt]: Date.now() } };
  }

  if (!omitRelations) {
    const includeEvents: SeqInclude = {
      model: Event,
      required: false,
      include: [
        {
          model: Job,
          include: [
            {
              model: Company,
              attributes: ["name"],
            },
          ],
        },
      ],
    };
    if (only) {
      includeEvents.where = { type: only };
    }

    include.push(includeEvents);
  }

  return specificFields
    ? {
        include,
        attributes: specificFields.map(
          //@ts-ignore
          (field: PublicFields) => PublicFieldsEnum[field]
        ),
      }
    : { include };
};

export const fetchFCC: () => void = async () => {
  let date: number;
  try {
    date = new Date(
      (
        await Event.findOne({
          where: { eventName: "FCC_SUBMIT_SUCCESS" },
          order: [["updatedAt", "DESC"]],
        })
      ).toJSON().createdAt
    ).getTime();
  } catch (e) {
    console.log(e);
    date = new Date("2020-07-01").getTime();
  }

  try {
    const studentsData: any = (
      await Student.findAll(getQuery(["fcc", "id"], true, true))
    ).map((a: any) => a.toJSON());
    const usernames: string[] = studentsData.map(
      (d: { fcc_account: string; id: string }) => d.fcc_account
    );
    const fccEvents: IFccEvent[] = (
      await axios.post(
        "https://us-central1-song-app-project.cloudfunctions.net/fcc-scraper",
        {
          usernames,
          date,
        }
      )
    ).data;
    // console.log(fccEvents[1]);

    //TODO fix types
    console.log(fccEvents);

    const parsedEvents: IEvent[] = flatMap(fccEvents[0], (userEvents: any) => {
      const username = userEvents.username;
      const { id: userId } = studentsData.find(
        (sd: any) => sd.fcc_account === username
      );
      const newSolvedChallengesIds: string[] = userEvents.progress.map(
        (challenge: any) => challenge.id
      );

      TaskOfStudent.findAll({
        where: { student_id: userId, status: !"done", type: "fcc" },
        include: [{ model: Task, attributes: ["id", "externalId"] }],
      }).then((unfinishedTOS: any) => {
        Array.from(unfinishedTOS).forEach((unfinishedTask: any) => {
          unfinishedTask = unfinishedTask.toJSON();
          let match = newSolvedChallengesIds.includes(
            unfinishedTask.Task.externalId
          );
          if (match)
            TaskOfStudent.update(
              { status: "done" },
              { where: { id: unfinishedTask.id } }
            );
        });
      });

      return userEvents.progress.map((challenge: any) => {
        const parsedEvent: IEvent = {
          relatedId: challenge.id,
          userId: userId,
          eventName: "FCC_SUBMIT_SUCCESS",
          type: "fcc",
          date: challenge.completedDate,
        };
        if (challenge.hasOwnProperty("repetition")) {
          parsedEvent.entry!.repetition = challenge.repetition;
        }
        return parsedEvent;
      });
    });

    const parsedBulkEvents: IEvent[] = flatMap(
      fccEvents[1],
      (userBulkEventsArr: any) => {
        const newSolvedChallengesIds: string[] = userBulkEventsArr.map(
          (challenge: any) => "id" + challenge.challenge
        );
        if (!userBulkEventsArr[0]) {
          return [];
        }

        const username = userBulkEventsArr[0].user;
        const { id: userId } = studentsData.find(
          (studentData: any) => studentData.fcc_account === username
        );

        TaskOfStudent.findAll({
          where: { student_id: userId, status: !"done", type: "fcc" },
          include: [{ model: Task, attributes: ["id", "externalId"] }],
        }).then((unfinishedTOS: any) => {
          Array.from(unfinishedTOS).forEach((unfinishedTask: any) => {
            unfinishedTask = unfinishedTask.toJSON();
            let match = newSolvedChallengesIds.includes(
              unfinishedTask.Task.externalId
            );
            if (match)
              TaskOfStudent.update(
                { status: "done" },
                { where: { id: unfinishedTask.id } }
              );
          });
        });

        return userBulkEventsArr.map((userBulkEvent: any) => {
          const parsedEvent: IEvent = {
            relatedId: "id" + userBulkEvent.challenge,
            userId: userId,
            eventName: "FCC_BULK_SUCCESS",
            type: "fcc",
            date: userBulkEvent.date,
          };
          if (userBulkEvent.hasOwnProperty("repetition")) {
            parsedEvent.entry!.repetition = userBulkEvent.repetition;
          }
          return parsedEvent;
        });
      }
    );

    await Event.bulkCreate([...parsedEvents, ...parsedBulkEvents]);

    return {
      success: true,
      newEvents: parsedEvents.length,
      newBulks: parsedBulkEvents.length,
    };
  } catch (err) {
    console.log(err);
    return { success: false, error: err.message };
  }
};

export const updateStudentTaskState: (
  events: IEvent[]
) => Promise<any[] | undefined> = async (events: IEvent[]) => {
  try {
    return Promise.all(
      // events.map((event: IEvent) =>
      //   TaskOfStudent.findOne({
      //     where: { student_id: event.userId, task_id: event.relatedId },
      //   }).then((tosRecord: any) => tosRecord.update({ status: "done" }))
      // )
      events.map((event: IEvent) =>
        TaskOfStudent.update(
          { status: "done" },
          {
            where: { student_id: event.userId },
            include: [
              {
                model: Task,
                where: { external_id: event.relatedId },
                required: true,
              },
            ],
            // returning:true // to get back the updated row
          }
        )
      )
    );
  } catch (e) {
    console.log(e);
  }
};

export const parseFilters: (stringified: string) => any = (
  stringfied: string
) => {
  try {
    const parsed: ITaskFilter = JSON.parse(stringfied);
    const studentClassSynonyms: any = { class: "name" };
    const studentFilters: string[] = ["class", "name"];
    const taskFilters: string[] = ["type"];
    const eventFilters: string[] = ["eventName", ""];

    return {
      student: Object.keys(parsed).reduce((obj: any, field: string) => {
        if (studentFilters.includes(field))
          //@ts-ignore
          obj[studentClassSynonyms[field]] = parsed[field];
        return obj;
      }, {}),
      task: Object.keys(parsed).reduce((obj: any, field: string) => {
        //@ts-ignore
        if (taskFilters.includes(field)) obj[field] = parsed[field];
        return obj;
      }, {}),
    };
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

// export const newparseFilters: (
//   stringifiedFilter: string,
//   outputTemplate: object,
//   fields: object
// ) => object = (
//   stringifiedFilter: string,
//   outputTemplate: object,
//   fields: object
// ) => {
//   try {

//     const parsedFilter: object = JSON.parse(stringifiedFilter);
//     for(let filter in parsedFilter) {
//       //@ts-ignore
//       // const aba:object = Object.values(parsedFilter[filter]).reduce((ima:object,filterField:Array<string|object>)=>{
//       //   const [key,value] = filterField;
//       //   if(typeof value !== object && typeof value !== null) {
//       //     ima.id = value;
//       //     return ima;
//       //   }
// if(typeof parsedFilter[filter]!== object && typeof parsedFilter[filter]!==null) {
//   outputTemplate[filter] = parsedFilter[filter]
// }

//       },{})

//     }
//   }catch(e){
//     return e;
//     // return {err:e, message:"Can't parse filters"}
//   }

//   }
// //   return Object.values(fields).reduce((output:object,field:string)=>{
// // if
//   // },outputTemplate)
// };
