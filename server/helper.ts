require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  IEvent,
  IJob,
  IStudent,
  PublicFields,
  PublicFieldsEnum,
  SeqInclude,
} from "./types";
//@ts-ignore
import { Student, Company, Job, Event, Class } from "./models";
import { Op } from "sequelize";

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
      !exclude.includes(elem) && array.indexOf(elem) === i
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
  onlyActive?: boolean
) => any = (
  specificFields: string[] | undefined = undefined,
  omitRelations: boolean = false,
  onlyActive: boolean = false
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
