export interface IMentor {
    id?: number;
    name: string;
    company: string;
    email: string;
    phone: string;
    address: string;
    job: string;
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
  