import { atom } from "recoil";
import { IStudent , IClassOfTeacher} from "../typescript/interfaces";

export const teacherStudents = atom<IStudent[]>({
  key: "teacherStudents",
  default: [],
});

export const classesOfTeacher = atom<IClassOfTeacher[]>({
  key: "classesOfTeacher",
  default: [],
});
