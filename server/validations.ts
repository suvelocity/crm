import Joi from "joi";

export const classSchema = Joi.object({
  course: Joi.string().required(),
  name: Joi.string().required(),
  startingDate: Joi.string().required(),
  endingDate: Joi.string().required(),
  cycleNumber: Joi.number().required(),
  zoomLink: Joi.string().required(),
  additionalDetails: Joi.string().required(),
});

export const classSchemaToPut = Joi.object({
  course: Joi.string(),
  name: Joi.string(),
  startingDate: Joi.string(),
  endingDate: Joi.string(),
  cycleNumber: Joi.number(),
  zoomLink: Joi.string(),
  additionalDetails: Joi.string(),
});

export const eventsSchema = Joi.object({
  studentId: Joi.number().required(),
  jobId: Joi.number().required(),
  status: Joi.string().required(),
  comment: Joi.string(),
});

export const jobSchema = Joi.object({
  //TODO: check what is required
  company: Joi.string().required(),
  position: Joi.string().required(),
  requirements: Joi.string().required(),
  location: Joi.string().required(),
  description: Joi.string().required(),
  contact: Joi.string().required(),
  additionalDetails: Joi.string(),
});

export const jobSchemaToPut = Joi.object({
  //TODO: check what is required
  company: Joi.string(),
  position: Joi.string(),
  requirements: Joi.string(),
  location: Joi.string(),
  description: Joi.string(),
  contact: Joi.string(),
  additionalDetails: Joi.string(),
});

export const studentSchema = Joi.object({
  email: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().required(),
  idNumber: Joi.string().required(),
  additionalDetails: Joi.string().required(),
  classId: Joi.number().required(),
  age: Joi.number().required(),
  address: Joi.string().required(),
  maritalStatus: Joi.string().required(),
  children: Joi.number().required(),
  academicBackground: Joi.string().required(),
  militaryService: Joi.string().required(),
  workExperience: Joi.string().required(),
  languages: Joi.string().required(),
  citizenship: Joi.string().required(),
});

export const studentSchemaToPut = Joi.object({
  email: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  phone: Joi.string(),
  idNumber: Joi.string(),
  additionalDetails: Joi.string(),
  classId: Joi.number(),
  age: Joi.number(),
  address: Joi.string(),
  maritalStatus: Joi.string(),
  children: Joi.number(),
  academicBackground: Joi.string(),
  militaryService: Joi.string(),
  workExperience: Joi.string(),
  languages: Joi.string(),
  citizenship: Joi.string(),
});
