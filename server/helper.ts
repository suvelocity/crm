import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
require("dotenv").config();

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
import { IEvent, IJob, IStudent } from "./types";
//@ts-ignore
import { Student, Company, Job, Event, Class } from "./models";

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
          attributes: ["jobId"],
        },
      ],
      attributes: ["firstName", "lastName", "idNumber", "id"],
    });

    if (!studentData) return;
    const jobIds: number[] = getUnique(
      //@ts-ignore
      studentData.Events.map((event: IEvent) => event.jobId),
      [hiredJobId]
    );
    await Promise.all(
      jobIds.map((jobId: number) =>
        Event.create({
          studentId,
          jobId,
          status: "Canceled",
          comment,
          date,
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
          attributes: ["studentId"],
        },
      ],
      // attributes: []
    });

    if (!jobData) return;

    const studentsIds = getUnique(
      //@ts-ignore
      jobData.Events.map((event: IEvent) => event.studentId),
      [hiredStudentId]
    );

    await Promise.all(
      studentsIds.map((studentId: number) =>
        Event.create({
          studentId,
          jobId,
          status: "Canceled",
          comment,
          date,
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
