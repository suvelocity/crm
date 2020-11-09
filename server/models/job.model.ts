import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";

interface IJob extends Document {
  company: mongoose.Schema.Types.ObjectId;
  position: string;
  requirements: string;
  location: string;
  qualifiedStudents: mongoose.Schema.Types.ObjectId[];
}

const jobSchema: Schema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  requirements: {
    type: [String],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  qualifiedStudents: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Student",
  },
});

export default mongoose.model<IJob>("Job", jobSchema);
