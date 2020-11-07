import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";

export interface IClass extends Document {
  name: string;
  courseName: string;
  cycleNumber: number;
  startDate: number;
  endDate: number;
  zoomLink: string;
}

const classSchema: Schema = new mongoose.Schema({
  name: {
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
    type: Number,
    required: true,
  },
  endDate: {
    type: Number,
    required: true,
  },
  zoomLink: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IClass>("Class", classSchema);
