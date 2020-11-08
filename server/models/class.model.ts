import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";

export interface IClassRoom extends Document {
  name: string;
  courseName: string;
  cycleNumber: number;
  startDate: number;
  endDate: number;
  zoomLink: string;
  students: mongoose.Schema.Types.ObjectId[];
}

const classRoomSchema: Schema = new mongoose.Schema(
  {
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
    students: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Student",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IClassRoom>("ClassRoom", classRoomSchema);
