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
  comment: Joi.string().allow(null, ""),
});

export const jobSchema = Joi.object({
  //TODO: check what is required
  company: Joi.string().required(),
  position: Joi.string().required(),
  requirements: Joi.string().required(),
  location: Joi.string().required(),
  description: Joi.string().required(),
  contact: Joi.string().required(),
  additionalDetails: Joi.string().allow(null, ""),
});

export const jobSchemaToPut = Joi.object({
  //TODO: check what is required
  company: Joi.string().allow(null, ""),
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
  academicBackground: Joi.string().required(),
  militaryService: Joi.string().required(),
  workExperience: Joi.string().required(),
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
