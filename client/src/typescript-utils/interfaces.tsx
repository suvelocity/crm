export interface IStudent {
  id: number;
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
  id: number;
  company: string;
  position: string;
  requirements: string;
  location: string;
  description: string;
  contact: string;
  additionalDetails: string;
}

export type eventType = string; //for now a string
export interface IEvent {
  id: string;
  studentId: string;
  jobId?: string;
  type: eventType;
  date: Date; //maybe number is better?
  comment?: string;
}
