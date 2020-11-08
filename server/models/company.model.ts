import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";

interface ICompany extends Document {
  name: string;
  contactName: string;
  contactNumber: string;
  contactEmail: string;
  location: string;
  ScaleUpContact: string;
  jobs: mongoose.Schema.Types.ObjectId[];
}

const companySchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  contactName: {
    type: String,
    required: true,
    trim: true,
  },
  contactNumber: {
    type: Number,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => {
        return validator.isEmail(value);
      },
      message: "email must be valid",
    },
  },
  location: {
    type: String,
    required: true,
  },
  ScaleUpContact: {
    type: String,
    required: true,
  },
  jobs: {
    type: [mongoose.Schema.Types.ObjectId],
  },
});

export default mongoose.model<ICompany>("Company", companySchema);
