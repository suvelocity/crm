import React, { useState } from "react";
import TeacherTaskBoard from "./TeacherTaskBoard";
import AddCircleIcon from "@material-ui/icons/AddCircle";
interface Task {
  externalLink?: string;
  createdBy: number;
  endDate: Date;
  type: string;
  title: string;
  body?: string;
  status: "active" | "disabled";
}

export default function Teacher() {
  const postTask = async (task: Task, arrOfStudentsIds: string[]) => {};

  const fetchStudents = async () => {};

  return (
    <div>
      <AddCircleIcon />
      <TeacherTaskBoard />
    </div>
  );
}
