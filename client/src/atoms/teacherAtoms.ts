import { atom } from "recoil";
import { IStudent } from "../typescript/interfaces";

export const teacherStudents = atom<IStudent[]>({
  key: "teacherStudents",
  default: [],
});

export const classesOfTeacher = atom<any[]>({
  key: "classesOfTeacher",
  default: [],
});
