import { IUser } from "../../types";
import bcrypt from "bcryptjs";

export const usersMock: IUser[] = [
  {
    email: "student@student.com",
    password: bcrypt.hashSync("student123!", 10),
    relatedId: 1,
    type: "student",
  },
  {
    email: "teacher@teacher.com",
    password: bcrypt.hashSync("teacher123!", 10),
    relatedId: 1,
    type: "teacher",
  },
  {
    email: "admin@admin.com",
    password: bcrypt.hashSync("admin123!", 10),
    relatedId: 1,
    type: "admin",
  },
];

export const usersCardentials: IUser[] = [
  {
    email: "student@student.com",
    password: "student123!",
    type: "student",
  },
  {
    email: "teacher@teacher.com",
    password: "teacher123!",
    type: "teacher",
  },
  {
    email: "admin@admin.com",
    password: "admin123!",
    type: "admin",
  },
];
