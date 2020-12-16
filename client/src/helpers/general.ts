import { status } from "../typescript/interfaces";
import { IStudent } from "../typescript/interfaces";
import Cookies from "js-cookie";

export const searchResults = (search: string | number, array: IStudent[]) => {
  return array.filter((student: IStudent) => {
    const values = Object.values(student);
    return values.some((keyVal: string | number) =>
      !keyVal ? false : keyVal.toString().includes(search.toString())
    );
  });
};

export const getRefreshToken = () => Cookies.get("refreshToken") || "";

export const formatPhone = (phoneNumber: string | undefined) => {
  if (!phoneNumber) return null;
  if (isNaN(+phoneNumber)) return phoneNumber;
  if (!phoneNumber.startsWith("05")) return phoneNumber;
  const newArr: string[] = phoneNumber.split("");
  newArr.splice(3, 0, "-");
  newArr.splice(7, 0, "-");
  return newArr.join("");
};

export const onTheSameDay = (day1: number, day2: number) => {
  const sameDayNumber = new Date(day1).getDate() === new Date(day2).getDate();
  const Day = 1000 * 60 * 60 * 24;
  const diffLessThanDay = Math.abs(day1 - day2) < Day;
  return sameDayNumber && diffLessThanDay;
};

export const statuses: status[] = [
  "Sent CV",
  "Phone Interview",
  "First interview",
  "Second interview",
  "Third Interview",
  "Forth interview",
  "Home Test",
  "Hired",
  "Rejected",
  "Irrelevant",
  "Removed Application",
  "Position Frozen",
  "Canceled",
];

export function capitalize(s: string | undefined) {
  if (s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}

export function convertDateToString(date: number) {
  let today = new Date(date);
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

export function formatToIsraeliDate(date: string) {
  const baseDate = new Date(date);
  return `${baseDate.getDate().toString().padStart(2, "0")}/${(
    baseDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${baseDate.getFullYear()}`;
}
