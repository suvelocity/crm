import mongoose from "mongoose";
import validator from "validator";
// שם מלא , גיל ,ת.ז ,נייד  ,מקום מגורים , מצב משפחתי, ילדים, רקע אקדמי  (תאריכי התחלה וסיום),שם הכשרה,( Adva, Excellenteam, Cybers)(תאריכי תחילה וסיום)
// שירות צבאי
// ניסיון תעסוקתי קודם
// שפות (ורמת שליטה)
// אזרחות
// הערות נוספות

const studentSchema = new mongoose.Schema({
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
  },
  lastName: {
    type: String,
    required: true,
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
  },
  idNumber: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
});

export default mongoose.model("Student", studentSchema);
