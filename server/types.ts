import { string } from "joi";

export interface IJob {
  id?: number;
  company: string;
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
  studentId: number;
  jobId: number;
  status: string;
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

type meeting = {date: string}
// type class = {name: string, cycleNumber: number}

export interface IDeshbord {
  id?: number;
  firstName:string;
  lastName:string;
  // Class: class;
  Mentor:IMentor;
  Meetings:meeting[];
}
export interface IMeeting {
  id?: number;
  mentorId:number;
  studentId:number;
  place:string;
}
