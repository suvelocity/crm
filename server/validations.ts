import Joi from "joi";

export const classSchema = Joi.object({
  course: Joi.string().required(),
  name: Joi.string().required(),
  startingDate: Joi.string().required(),
  endingDate: Joi.string().required(),
  cycleNumber: Joi.number().required(),
  zoomLink: Joi.string().allow(null, ""),
  additionalDetails: Joi.string().allow(null, ""),
});

export const classSchemaToPut = Joi.object({
  course: Joi.string(),
  name: Joi.string(),
  startingDate: Joi.string(),
  endingDate: Joi.string(),
  cycleNumber: Joi.number(),
  zoomLink: Joi.string(),
  additionalDetails: Joi.string().allow(null, ""),
});

export const eventsSchema = Joi.object({
  studentId: Joi.number().required(),
  jobId: Joi.number().required(),
  status: Joi.string().required(),
  date: Joi.date(),
  comment: Joi.string().allow(null, ""),
});

export const jobSchema = Joi.object({
  //TODO: check what is required
  companyId: Joi.number().required(),
  position: Joi.string().required(),
  requirements: Joi.string().required(),
  location: Joi.string().required(),
  description: Joi.string().allow(null, ""),
  contact: Joi.string().required(),
  additionalDetails: Joi.string().allow(null, ""),
});

export const jobSchemaToPut = Joi.object({
  //TODO: check what is required
  companyId: Joi.number().allow(null, ""),
  position: Joi.string().allow(null, ""),
  requirements: Joi.string().allow(null, ""),
  location: Joi.string().allow(null, ""),
  description: Joi.string().allow(null, ""),
  contact: Joi.string().allow(null, ""),
  additionalDetails: Joi.string().allow(null, ""),
});

export const studentSchema = Joi.object({
  email: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().required(),
  idNumber: Joi.string().required(),
  additionalDetails: Joi.string().allow(null, ""),
  classId: Joi.number().required(),
  age: Joi.number().required(),
  address: Joi.string().required(),
  maritalStatus: Joi.string().required(),
  children: Joi.number().required(),
  academicBackground: Joi.string().allow(null, ""),
  militaryService: Joi.string().allow(null, ""),
  workExperience: Joi.string().allow(null, ""),
  languages: Joi.string().required(),
  citizenship: Joi.string().required(),
});

export const studentSchemaToPut = Joi.object({
  email: Joi.string().allow(null, ""),
  firstName: Joi.string().allow(null, ""),
  lastName: Joi.string().allow(null, ""),
  phone: Joi.string().allow(null, ""),
  idNumber: Joi.string().allow(null, ""),
  additionalDetails: Joi.string().allow(null, ""),
  classId: Joi.number().allow(null, ""),
  age: Joi.number().allow(null, ""),
  address: Joi.string().allow(null, ""),
  maritalStatus: Joi.string().allow(null, ""),
  children: Joi.number().allow(null, ""),
  academicBackground: Joi.string().allow(null, ""),
  militaryService: Joi.string().allow(null, ""),
  workExperience: Joi.string().allow(null, ""),
  languages: Joi.string().allow(null, ""),
  citizenship: Joi.string().allow(null, ""),
});

export const companySchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  description: Joi.string().allow(null, ""),
  contactName: Joi.string().allow(null, ""),
  contactNumber: Joi.string().allow(null, ""),
  contactPosition: Joi.string().allow(null, ""),
});

export const companySchemaToPut = Joi.object({
  name: Joi.string().allow(null, ""),
  location: Joi.string().allow(null, ""),
  description: Joi.string().allow(null, ""),
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

export const noticeSchema = Joi.object({
  classId: Joi.number().required(),
  type: Joi.string().required(),
  body: Joi.string().required(),
  createdBy: Joi.number().required(),
});

export const taskSchema = Joi.object({
  lessonId: Joi.number().required(),
  externalId: Joi.string().allow(null, ""),
  externalLink: Joi.string().allow(null, ""),
  createdBy: Joi.number().required(),
  endDate: Joi.date().required(),
  type: Joi.string().required(),
  status: Joi.string().required(),
  body: Joi.string().required(),
});
