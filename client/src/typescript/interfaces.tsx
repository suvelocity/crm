export interface IStudent {
  id?: number;
  firstName: string;
  lastName: string;
  idNumber: string;
  email: string;
  phone?: string;
  Class: IClass;
  address: string;
  age?: number;
  maritalStatus: string;
  children?: number;
  academicBackground: string;
  militaryService?: string;
  workExperience?: string;
  languages?: string;
  citizenship?: string;
  additionalDetails?: string;
  mentorId: number | null;
  mentor?: IMentor | null;
  MentorStudents?: IPair[];
  Events: IEvent[];
  resumeLink?: string;
  fccAccount?: string;
}

export interface ITeacher {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string;
  Classes:  IClass[];
  Task?: ITask;
  Lesson?: ILesson;
  Notice?: INotice;
}
export interface tempTeacherClass {
  classId: string;
  Class: IClass;
}

export interface IPair {
  id: number;
  mentorProgramId: number;
  studentId: number;
  mentorId: number;
  Mentor?: IMentor;
}

export interface IJob {
  id?: number;
  Company: ICompany;
  position: string;
  requirements: string;
  location: string;
  description: string;
  contact: string;
  additionalDetails: string;
  Events: IEvent[];
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
  Students: Omit<IStudent, "Class">[];
  cmId?:string
}
export interface IClassOfTeacher {
  id: number;
  Class: Pick<IClass, "id" | "name" | "Students">;
  classId: number;
  createdAt?: Date;
  deletedAt?: Date | null;
  teacherId: number;
  updatedAt?: Date;
}

export interface ICompany {
  id?: number;
  name: string;
  contactPosition?: string;
  contactName?: string;
  contactNumber?: string;
  location: string;
  description?: string;
  Jobs: IJob[];
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
  id?: number;
  eventName: status;
  userId?: number;
  relatedId?: number;
  entry?: { [key: string]: any };
  date: string;
  type: eventTypes;
  Student?: IStudent;
  Job?: IJob;
}

type eventTypes = "jobs" | "courses" | "mentors" | "challengeMe" | "fcc";

export type IFilterOptions = "Class" | "Course" | "JobStatus" | "Name";

export interface filterStudentObject {
  Class?: string[];
  Course?: string[];
  Company?: string[];
  JobStatus?: string[];
  Name?: string[];
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
  role: string;
  experience: number;
  available: boolean;
  gender: string;
  Students?: Partial<IStudent>[];
  Meetings?: Partial<IMeeting>[];
  student?: number;
  MentorStudents?: IMentorStusent[];
}

export interface IMentorStusent {
  id?: number;
  mentorId: number;
  mentorProgramId: number;
  studentId: number;
  Mentor?: Partial<IMentor>;
  MentorProgram?: Partial<IMentorProgram>;
  Meetings?: Partial<IMeeting>[];
  Student?: Partial<IStudent>;
}

export interface IMentorProgramDashboard {
  id?: number;
  firstName: string;
  lastName: string;
  MentorStudents: Partial<IMentorStusent>[];
}

export interface IMeeting {
  id?: number;
  date: string;
  pairId: number;
  place: string;
  occurred: boolean;
  mentorFeedback: string;
  studentFeedback: string;
  title: string;
}
export interface IPairMeetings {
  id?: number;
  Mentor: Partial<IMentor>;
  Student: Partial<IStudent>;
  Meetings: IMeeting[];
}

export interface IMentorProgram {
  id?: number;
  classId: number;
  name: string;
  open: boolean;
  endDate: string;
  startDate: string;
  email: boolean
}

export interface IMentorForm {
  id?: number;
  programId: number;
  url: string;
  answerUrl: string;
  title: string;
  createdAt: string;
  sent: boolean;
}

export interface IMentorProgramForms {
  id?: number;
  MentorForms?: IMentorForm[];
}

export interface IUser {
  id?: number;
  userType: string;
  firstName?: string;
  lastName?: string;
  idNumber?: string;
  email?: string;
  phone?: string;
  Class?: IClass;
  address?: string;
  age?: number;
  maritalStatus?: string;
  children?: number;
  academicBackground?: string;
  militaryService?: string;
  workExperience?: string;
  languages?: string;
  citizenship?: string;
  additionalDetails?: string;
  Events?: IEvent[];
}

export interface IUserSignIn {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface INotice {
  id?: number;
  classId: number;
  type: "regular" | "important" | "critical";
  body: string;
  createdBy: number;
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

export type taskType = "manual" | "challengeMe" | "fcc" | "quiz";
export interface ITask {
  id?: number;
  createdAt?: number;
  updatedAt?: number;
  deletedAt?: number;
  title: string;
  lessonId?: number;
  externalId?: string;
  externalLink?: string;
  createdBy: number;
  endDate: Date;
  type: taskType;
  status: "active" | "disabled";
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

export type ThemeType = "dark" | "light";

export interface filterMentorObject {
  Company: string;
  Gender: string;
  Address: string;
  Available: string;
  Search: string;
}

export type IOption = {
  id: number;
  title: string;
};
export type IField = {
  id: number;
  title: string;
  Options: IOption[];
};
export type IForm = {
  id: number;
  name: string;
  isQuiz: boolean;
};
export type IFormExtended = {
  id: number;
  name: string;
  isQuiz: boolean;
  Fields: IField[];
};
export type IAnswer = {
  fieldId: number;
  optionId: number;
};

export type IAnswered = {
  optionId: number;
  optionTitle: string;
};

export interface AnsweredFiled {
  id: number;
  title: string;
  answer: IAnswered;
}

export type QuizSubmission = {
  id: number;
  studentid: number;
  fieldid: number;
  fieldstitle: string;
  answerid: number;
  answertitle: string;
};
