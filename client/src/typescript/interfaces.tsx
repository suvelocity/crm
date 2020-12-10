export interface IStudent {
  id?: number;
  firstName: string;
  lastName: string;
  idNumber: string;
  email: string;
  phone: string;
  Class: IClass;
  address: string;
  age: number;
  maritalStatus: string;
  children: number;
  academicBackground: string;
  militaryService: string;
  workExperience: string;
  languages: string;
  citizenship: string;
  additionalDetails: string;
  Events: IEvent[];
}
export interface ICompany {
  id?: number;
  name: string;
  contactName: string;
  contactNumber: string;
  contactEmail: string;
  location: string;
  ScaleUpContact: string;
  jobs: Pick<IJob, "id">;
}
export interface IJob {
  id?: number;
  company: string;
  position: string;
  requirements: string;
  location: string;
  description: string;
  contact: string;
  additionalDetails: string;
  Events: IEvent[];
}

export interface IClass {
  id: number;
  course: string;
  name: string;
  startingDate: string;
  endingDate: string;
  cycleNumber: number;
  zoomLink: string;
  additionalDetails: string;
  Students: Omit<IStudent, "Class">[];
}

export type status =
  | "Sent CV"
  | "Phone Interview"
  | "First interview"
  | "Second interview"
  | "Third Interview"
  | "Forth interview"
  | "Home Test"
  | "Hired"
  | "Rejected"
  | "Irrelevant"
  | "Removed Application"
  | "Position Frozen"
  | "Canceled";

export interface IEvent {
  status: status;
  studentId?: number;
  jobId?: number;
  comment?: string;
  date: string;
  Student?: IStudent;
  Job?: IJob;
}

type filterOptions = "Class" | "Course" | "JobStatus" | "Name";

export interface filterStudentObject {
  Class: string;
  Course: string;
  JobStatus: string;
  Name: string;
}
export interface Name {
  firstName: string;
  lastName: string;
}

export interface SelectInputs {
  filterBy: string;
  possibleValues: string[];
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
};

export interface MentorClassDashboard {
  id?: number;
  firstName:string;
  lastName:string;
  Class: Partial<IClass>;
  Mentor: IMentor;
  Meetings: Partial<IMeeting>[];
};

export interface IMeeting {
  id?: number;
  date:string;
  mentorId:number;
  studentId:number;
  place:string;
};
