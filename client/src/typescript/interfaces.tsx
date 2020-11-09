export interface IStudent {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    idNumber: string;
    description: string;
    course: any; // Change This.
  }
export interface ICompany {
  id?:number
  name:string;
  contactName:string;
  contactNumber:string;
  contactEmail:string;
  location:string;
  ScaleUpContact:string;
  jobs:Pick<IJob, "id">
}
export interface IJob {
    id?:number
    company: Pick<ICompany, "name">;
    position: string;
    requirements?: string[];
    contact: string;
    location: string;
    description: string;
    qualifiedStudents?:Pick<IStudent, "idNumber">[]
  }
  