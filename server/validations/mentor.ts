import Joi from "joi";

export const meetingSchema = Joi.object({
    studentId: Joi.number().required(),
    place: Joi.string().allow(null, ""),
    date: Joi.date().min(new Date()).allow(null, "")
  })
  
  export const meetingSchemaToPut = Joi.object({
    place: Joi.string().allow(null, ""),
    date: Joi.date().min(new Date()).allow(null, "")
  })
  
  export const mentorSchema = Joi.object({
    name: Joi.string().required(),
    company: Joi.string().allow(null, ""),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    job: Joi.string().allow(null, ""),
    available: Joi.boolean().allow(null, ""),
  });
  
  export const mentorSchemaToPut = Joi.object({
    name: Joi.string().allow(null, ""),
    company: Joi.string().allow(null, ""),
    email: Joi.string().allow(null, ""),
    phone: Joi.string().allow(null, ""),
    address: Joi.string().allow(null, ""),
    job: Joi.string().allow(null, ""),
    available: Joi.boolean().allow(null, ""),
  });
  
  export const studentMentorIdPut = Joi.object({
    MentorId: Joi.number().allow(null, ""),
  });