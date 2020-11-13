export interface IStudent {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  idNumber: string;
  additionalDetails: string;
  class: string;
  age: string;
  address: string;
  jobs: Partial<IJob>[];
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
  id: string;
  company: string;
  position: string;
  requirements: string;
  location: string;
  students: Partial<IStudent>[];
}
