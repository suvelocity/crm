import { Model } from "sequelize/types";
export interface IJob {
  Company?: ICompany;
  id?: number;
  companyId: number;
  position: string;
  requirements: string;
  location: string;
  description: string;
  contact: string;
  additionalDetails: string;
}

export interface IStudent {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  idNumber: string;
  additionalDetails: string;
  classId: number;
  age: number;
  address: string;
  maritalStatus: string;
  children: number;
  academicBackground: string;
  militaryService: string;
  workExperience: string;
  languages: string;
  citizenship: string;
  fccAccount?: string;
  resumeLink?: string;
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
}

export interface IEvent {
  id?: number;
  userId: number;
  relatedId: number;
  eventName: string;
  entry?: any;
  type: string;
  date: Date;
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
  type: string;
  status: string;
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
export interface SeqInclude {
  model: Model;
  attributes?: string[];
  include?: SeqInclude[];
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
export interface IForm {
  id?: number;
  name: string;
  creatorId: number;
  isQuiz?: boolean
}
export interface IFormSubmission {
  id?: number;
  quizId: number;
  studentId: number;
  rank: number;
}

export interface IField {
  id?: number;
  title: string;
  formId: number;
  typeId?: number;
}

type meeting = { date: string };
// type class = {name: string, cycleNumber: number}

export interface IDashboard {
  id?: number;
  firstName: string;
  lastName: string;
  // Class: class;
  Mentor: IMentor;
  Meetings: meeting[];
}
export interface IMeeting {
  id?: number;
  mentorId: number;
  studentId: number;
  place: string;
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
