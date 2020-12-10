export interface IJob {
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
  comment?: string;
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
