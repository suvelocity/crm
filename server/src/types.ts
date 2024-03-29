import { Model } from "sequelize/types";
import { Request } from "express";
import { number } from "joi";

export interface IJob {
  Company?: ICompany;
  id?: number;
  companyId: number;
  position: string;
  requirements: string;
  location: string;
  description: string;
  additionalDetails: string;
  isActive: string;
  closeComment: string;
}

export interface ITeacher {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string;
  Class?: IClass;
  Task?: ITask;
  Lesson?: ILesson;
  Notice?: INotice;
  cmUser?: string;
}

export interface IAcademicBackground {
  id?: number;
  institution: string;
  studyTopic: string;
  degree: string;
  averageScore: number;
}

export interface IStudent {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  idNumber: string | null;
  additionalDetails?: string;
  classId: number;
  gradeAvg?: number;
  age?: number | string | null;
  address: string;
  maritalStatus: string;
  children?: number;
  Events?: IEvent[];
  AcademicBackgrounds?: IAcademicBackground[];
  militaryService?: string;
  workExperience?: string;
  languages?: string;
  citizenship?: string;
  fccAccount?: string;
  resumeLink?: string;
  cmUser?: string;
}

export interface IClass {
  id?: number;
  course: string;
  name: string;
  startingDate: string;
  endingDate: string;
  cycleNumber: number;
  zoomLink: string;
  additionalDetails: string;
  cmId?: string;
}

export interface IEvent {
  id?: number;
  userId: number;
  updatedAt?: Date;
  relatedId: string;
  eventName: string;
  entry?: any;
  maxDate?: Date;
  Job?: IJob;
  type: string;
  date: Date;
  cancelMail?: boolean;
}
export interface RequestWithUser extends Request {
  user?: IUser;
}
export interface ICompany {
  id?: number;
  name: string;
  contactPosition?: string;
  contactName?: string;
  contactNumber?: string;
  location: string;
  description?: string;
}

export interface IUser {
  id?: number;
  email: string;
  password: string;
  type: string;
  relatedId?: number;
}

export interface ILesson {
  id?: number;
  classId: number;
  title: string;
  body: string;
  resource?: string;
  zoomLink?: string;
  createdBy: number;
}

export interface INotice {
  id?: number;
  classId: number;
  type: string;
  body: string;
  createdBy: number;
}

export interface ITask {
  id?: number;
  lessonId?: number;
  externalId?: string | number;
  externalLink?: string;
  createdBy: number;
  endDate: Date;
  type: "manual" | "challengeMe" | "fcc" | "quiz";
  status: "active" | "disabled";
  title: string;
  body?: string;
}

export interface ITaskofStudent {
  id?: number;
  studentId: number;
  taskId: number;
  type: string;
  status: string;
  submitLink?: string;
  description?: string;
}

export interface ILabel {
  id?: number;
  name: string;
}
export interface ITaskLabel {
  id?: number;
  taskId: number;
  labelId: number;
  Criteria: ICriterion[];
  toDelete?: boolean;
}

export interface ICriterion {
  id?: number;
  taskId: number;
  labelId: number;
  name: string;
  toDelete?: boolean;
}

export interface IGrade {
  id?: number;
  belongsToId: number;
  belongsTo: string;
  studentId: number;
  grade: number;
  freeText: string;
  weight?: number;
}
export interface SeqInclude {
  model: Model;
  attributes?: string[];
  include?: SeqInclude[];
  required?: boolean;
  as?: string;
  where?: {};
}

export type PublicFields = "firstname" | "lastname" | "fcc" | "id";

export enum PublicFieldsEnum {
  firstname = "first_name",
  lastname = "last_name",
  fcc = "fcc_account",
  id = "id",
}
export interface IMentor {
  id?: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  job: string;
  available: boolean;
  gender: string;
}
export interface gradeObj {
  studentId: string;
  grade: number;
}
export interface LabelIdsWithGrades {
  labelId: string;
  Grades: gradeObj[];
  Criteria: { Grades: gradeObj[] }[];
}
export interface studentGrades {
  sum: number;
  count: number;
}
export interface LabelIdsWithGradesPerStudent {
  [labelId: string]: { [studentId: string]: studentGrades };
}
export interface IForm {
  id?: number;
  name: string;
  createdBy: number;
}
export interface IFormSubmission {
  id?: number;
  quizId: number;
  studentId: number;
  rank: number;
}

type meeting = { date: string };

export interface IDashboard {
  id?: number;
  firstName: string;
  lastName: string;
  Mentor: IMentor;
  Meetings: meeting[];
}

export interface IMeeting {
  id?: number;
  mentorId: number;
  studentId: number;
  place: string;
}
export interface IMentorForm {
  id?: number;
  programId: number;
  url: string;
  title: string;
}

export interface IFccEvent {}
export interface IMentorProgram {
  id?: number;
  classId: number;
  name: string;
  open: boolean;
  endDate: string;
  startDate: string;
}

export interface ITaskFilter {
  class: string;
  type: "manual" | "challengeMe" | "fcc" | "quiz";
}
