import Joi from "joi";

export const classSchema = Joi.object({
  course: Joi.string().required(),
  name: Joi.string().required(),
  startingDate: Joi.string().required(),
  endingDate: Joi.string().required(),
  cycleNumber: Joi.number().required(),
  zoomLink: Joi.string().allow(null, ""),
  additionalDetails: Joi.string().max(500).allow(null, ""),
});

export const classSchemaToPut = Joi.object({
  course: Joi.string(),
  name: Joi.string(),
  startingDate: Joi.string(),
  endingDate: Joi.string(),
  cycleNumber: Joi.number(),
  zoomLink: Joi.string(),
  additionalDetails: Joi.string().max(500).allow(null, ""),
});

export const eventsSchema = Joi.object({
  userId: Joi.number().required(),
  relatedId: Joi.number().required(),
  eventName: Joi.string().required(),
  date: Joi.date(),
  type: Joi.string().required(),
  // entry: Joi.string().allow(null, ""),
});

export const jobSchema = Joi.object({
  //TODO: check what is required
  companyId: Joi.number().required(),
  position: Joi.string().required(),
  requirements: Joi.string().max(500).required(),
  location: Joi.string().required(),
  description: Joi.string().max(500).allow(null, ""),
  contact: Joi.string().required(),
  additionalDetails: Joi.string().max(500).allow(null, ""),
});

export const jobSchemaToPut = Joi.object({
  //TODO: check what is required
  companyId: Joi.number().allow(null, ""),
  position: Joi.string().allow(null, ""),
  requirements: Joi.string().max(500).allow(null, ""),
  location: Joi.string().allow(null, ""),
  description: Joi.string().max(500).allow(null, ""),
  contact: Joi.string().allow(null, ""),
  additionalDetails: Joi.string().max(500).allow(null, ""),
});

export const teacherOfClassSchema = Joi.array().items({
  teacherId: Joi.string(), 
  classId: Joi.string()
})

export const studentSchema = Joi.object({
  email: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().required(),
  idNumber: Joi.string().required(),
  additionalDetails: Joi.string().max(500).allow(null, ""),
  classId: Joi.number().required(),
  age: Joi.number().required(),
  address: Joi.string().allow(null, ""),
  maritalStatus: Joi.string().allow(null, ""),
  children: Joi.number().required(),
  academicBackground: Joi.string().allow(null, ""),
  militaryService: Joi.string().max(500).allow(null, ""),
  workExperience: Joi.string().max(500).allow(null, ""),
  languages: Joi.string().allow(null, ""),
  citizenship: Joi.string().allow(null, ""),
  fccAccount: Joi.string().max(30).allow(null, ""),
  resumeLink: Joi.string().max(500).allow(null, ""),
});

export const teacherSchema = Joi.object({
  email: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  idNumber: Joi.string().required(),
  phone: Joi.string().allow(null, "")
});

export const studentSchemaToPut = Joi.object({
  email: Joi.string().allow(null, ""),
  firstName: Joi.string().allow(null, ""),
  lastName: Joi.string().allow(null, ""),
  phone: Joi.string().allow(null, ""),
  idNumber: Joi.string().allow(null, ""),
  additionalDetails: Joi.string().max(500).allow(null, ""),
  classId: Joi.number().allow(null, ""),
  age: Joi.number().allow(null, ""),
  address: Joi.string().allow(null, ""),
  maritalStatus: Joi.string().max(500).allow(null, ""),
  children: Joi.number().allow(null, ""),
  academicBackground: Joi.string().allow(null, ""),
  militaryService: Joi.string().max(500).allow(null, ""),
  workExperience: Joi.string().max(500).allow(null, ""),
  languages: Joi.string().allow(null, ""),
  citizenship: Joi.string().allow(null, ""),
  fccAccount: Joi.string().max(30).allow(null, ""),
  resumeLink: Joi.string().max(500).allow(null, ""),
});

export const companySchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  description: Joi.string().max(500).allow(null, ""),
  contactName: Joi.string().allow(null, ""),
  contactNumber: Joi.string().allow(null, ""),
  contactPosition: Joi.string().allow(null, ""),
});

export const companySchemaToPut = Joi.object({
  name: Joi.string().allow(null, ""),
  location: Joi.string().allow(null, ""),
  description: Joi.string().max(500).allow(null, ""),
  contactName: Joi.string().allow(null, ""),
  contactNumber: Joi.string().allow(null, ""),
  contactPosition: Joi.string().allow(null, ""),
});

export const signInSchema = Joi.object({
  username: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const lessonSchema = Joi.object({
  classId: Joi.number().required(),
  title: Joi.string().required(),
  body: Joi.string().required(),
  resource: Joi.string().allow(null, ""),
  zoomLink: Joi.string().allow(null, ""),
  createdBy: Joi.number().required(),
});

export const lessonSchemaToPut = Joi.object({
  classId: Joi.number().allow(null, ""),
  title: Joi.string().allow(null, ""),
  body: Joi.string().allow(null, ""),
  resource: Joi.string().allow(null, ""),
  zoomLink: Joi.string().allow(null, ""),
  createdBy: Joi.number().allow(null, ""),
});

export const noticeSchema = Joi.object({
  classId: Joi.number().required(),
  type: Joi.string().required(),
  body: Joi.string().required(),
  createdBy: Joi.number().required(),
});

export const taskSchema = Joi.object({
  lessonId: Joi.number().allow(null, ""),
  externalId: Joi.string().allow(null, ""),
  externalLink: Joi.string().allow(null, ""),
  createdBy: Joi.number().required(),
  endDate: Joi.date().required(),
  type: Joi.string().required(),
  status: Joi.string().required(),
  body: Joi.string().allow(null, ""),
  title: Joi.string().required(),
});
export const meetingSchema = Joi.object({
  pairId: Joi.number().required(),
  place: Joi.string().allow(null, ""),
  title: Joi.string().allow(null, ""),
  date: Joi.date().min(new Date()).required(),
  occurred: Joi.boolean().required(),
  mentorEmail: Joi.string().email().required(),
  mentorName: Joi.string().required(),
  studentEmail: Joi.string().email().required(),
  studentName: Joi.string().required(),
});

export const meetingSchemaToPut = Joi.object({
  place: Joi.string().allow(null, ""),
  date: Joi.date().min(new Date()).allow(null, ""),
  title: Joi.string().allow(null, ""),
  studentFeedback: Joi.string().allow(null, ""),
  mentorFeedback: Joi.string().allow(null, ""),
  occurred: Joi.boolean().allow(null, ""),
  mentorEmail: Joi.string().email(),
  mentorName: Joi.string(),
  studentEmail: Joi.string().email(),
  studentName: Joi.string()
});

export const mentorSchema = Joi.object({
  name: Joi.string().required(),
  company: Joi.string().allow(null, ""),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  role: Joi.string().allow(null, ""),
  experience: Joi.number().allow(null, ""),
  available: Joi.boolean().allow(null, ""),
  gender: Joi.string().required().allow(null, ""),
});

export const mentorSchemaToPut = Joi.object({
  name: Joi.string().allow(null, ""),
  company: Joi.string().allow(null, ""),
  email: Joi.string().allow(null, ""),
  phone: Joi.string().allow(null, ""),
  address: Joi.string().allow(null, ""),
  role: Joi.string().allow(null, ""),
  experience: Joi.number().allow(null, ""),
  available: Joi.boolean().allow(null, ""),
  gender: Joi.string().allow(null, ""),
});

export const mentorProgramSchema = Joi.object({
  classId: Joi.number().required(),
  name: Joi.string().required(),
  open: Joi.boolean().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
});

export const mentorProgramSchemaToPut = Joi.object({
  classId: Joi.number().allow(null, ""),
  name: Joi.string().allow(null, ""),
  open: Joi.boolean().allow(null, ""),
  startDate: Joi.date().allow(null, ""),
  endDate: Joi.date().allow(null, ""),
});

export const mentorStudentSchema = Joi.object({
  mentorProgramId: Joi.number().required(),
  mentorId: Joi.number().required(),
  studentId: Joi.number().required(),
});

export const mentorStudentSchemaToPut = Joi.object({
  mentorProgramId: Joi.number().allow(null, ""),
  mentorId: Joi.number().allow(null, ""),
  studentId: Joi.number().allow(null, ""),
});
export const mentorFormSchema = Joi.object({
  programId: Joi.number().required(),
  url: Joi.string().required(),
  answerUrl: Joi.string().required(),
  title: Joi.string().required(),
});
export const mentorFormSchemaToPut = Joi.object({
  programId: Joi.number().allow(null, ""),
  url: Joi.string().allow(null, ""),
  answerUrl: Joi.string().allow(null, ""),
  title: Joi.string().allow(null, ""),
});

export const quizSchema = Joi.object({
  name: Joi.string().required(),
  createdBy: Joi.number().required(),
});

export const quizSchemaToPut = Joi.object({
  name: Joi.string().allow(null, ""),
  createdBy: Joi.number().allow(null, ""),
});

export const quizSubmissionSchema = Joi.object({
  quizId: Joi.number().required(),
  studentId: Joi.number().required(),
  rank: Joi.number().required(),
});

export const quizSubmissionSchemaToPut = Joi.object({
  quizId: Joi.number().allow(null, ""),
  studentId: Joi.number().allow(null, ""),
  rank: Joi.number().allow(null, ""),
});
