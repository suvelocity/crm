import mongoose, { Schema, Document } from "mongoose";
import { IStudent } from "./student.model";
import validator from "validator";

export interface IJob extends Document {
  // company: mongoose.Schema.Types.ObjectId;
  company: string;
  position: string;
  requirements: string;
  location: string;
  students: mongoose.Schema.Types.ObjectId[] | IStudent[];
}

const jobSchema: Schema = new mongoose.Schema({
  company: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "Company",
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  requirements: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

export default mongoose.model<IJob>("Job", jobSchema);
