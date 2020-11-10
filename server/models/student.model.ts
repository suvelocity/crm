import { required } from "joi";
import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";

export interface IStudent extends Document {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  idNumber: string;
  description: string;
  address: string;
  // class: mongoose.Schema.Types.ObjectId;
  class: string;
  jobs: mongoose.Schema.Types.ObjectId[] | IStudent[];
  age: number;
}

const studentSchema: Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value: string) => {
        return validator.isEmail(value);
      },
      message: "email must be valid",
    },
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => {
        return validator.isMobilePhone(value);
      },
      message: "mobile must be valid",
    },
    trim: true,
  },
  idNumber: {
    type: String,

    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  class: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "Class",
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  jobs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
});

studentSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model<IStudent>("Student", studentSchema);
