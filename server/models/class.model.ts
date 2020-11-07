import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";

interface IClass extends Document {
  className: string;
  courseName: string;
  cycleNumber: number;
  startDate: Date;
  endDate: Date;
  zoomLink: string;
}

const classSchema: Schema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
    trim: true,
  },
  cycleNumber: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  zoomLink: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IClass>("Class", classSchema);
