//OGCRM
type userType = 'admin'|'student'|'teacher'

export interface IUser {
  id?: number;
  userType: userType;
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

export interface ITeacher {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string;
  Classes?: {classId:string, Class:IClass}[];
  Task?: ITask;
  Lesson?: ILesson;
  Notice?: INotice;
}
export interface tempTeacherClass {
  classId:string;
  Class:IClass;
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
}

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
  mentorId: number | null;
  mentor?: IMentor | null;
  MentorStudents?: IPair[];
  Events: IEvent[];
  resumeLink?: string;
  fccAccount?: string;
}

type eventTypes = "jobs" | "courses" | "mentors" | "challengeMe" | "fcc";

type filterOptions = "Class" | "Course" | "JobStatus" | "Name";
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
export interface filterStudentObject {
  Class: string[];
  Course: string[];
  JobStatus: string[];
  Name: string[];
}
export interface Name {
  firstName: string;
  lastName: string;
}

export interface SelectInputs {
  filterBy: string;
  possibleValues: string[];
}

//Mentor
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
  MentorStudents?: IMentorStudent[];
}
export interface IPair {
  id: number;
  mentorProgramId: number;
  studentId: number;
  mentorId: number;
  Mentor?: IMentor;
}
export interface IMentorStudent {
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
  MentorStudents: Partial<IMentorStudent>[];
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
}

export interface filterMentorObject {
  Company: string;
  Gender: string;
  Address: string;
  Available: string;
  Search: string;
}
export interface IMentorForm {
  id?: number;
  programId: number;
  url: string;
  answerUrl: string;
  title: string;
  createdAt: string;
}

export interface IMentorProgramForms {
  id?: number;
  MentorForms?: IMentorForm[];
}


//Classroom
export interface IClassOfTeacher {
  id: number
  Class: Pick<IClass,'id'|'name'|'Students'>;
  classId: number
  createdAt?: Date
  deletedAt?: Date|null
  teacherId: number
  updatedAt?:Date
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

export type taskType = 'manual'|'challengeMe'|'fcc'|'quizMe';
export interface ITask {
  id?: number;
  createdAt?: number;
  updatedAt?: number;
  deletedAt?: number;
  title:string;
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

//Quizme

export type IOption = {
  id?: number,
  title: string,
  isCorrect?: boolean
}
export interface IField  {
  id: number;
  title: string;
  formId: number;
  typeId: number;
};
export type IFieldExtended = IField & {Options?: IOption[]};

export type IForm = {
  id: number;
  name: string;
  isQuiz: boolean;
};
export type IFormExtended = {
  id: number,
  name: string,
  isQuiz: boolean,
  Fields: IFieldExtended[]
  Teacher: Pick<ITeacher,'firstName'|'lastName'>  
}
export type IAnswer = {
  fieldId: number;
  optionId: number;
};

export type IAnswered = {
  optionId: number;
  optionTitle: string;
};

export interface AnsweredField {
  id: number;
  title: string;
  answer: IAnswered;
}
export interface IFieldSubmission{
  id?:number;
  field_id:number;
  student_id:number;
  textual_answer?:string;
  Options?:IOption[]
  created_at?:Date;
  updated_at?:Date;
  deleted_at?:Date;
}
export type QuizSubmission = {
  id: number;
  studentId: number;
  fieldId: number;
  fieldTitle: string;
  answerid: number;
  answertitle: string;
};
// Field Types
export type IFormTextField = Required<IField>  
export type IFormSingleChoiceField = Required<IFieldExtended>  
export type IFormMultipleChoiceField = Required<Omit<IFieldExtended,'isCorrect'>>  
