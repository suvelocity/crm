import React, { useState, useEffect, useContext } from "react";
import TeacherTaskBoard from "./TeacherTaskBoard";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { AuthContext } from "../../../helpers";
import network from "../../../helpers/network";
import { useRecoilState } from "recoil";
import { teacherStudents } from "../../../atoms";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import AddTask from "../lessons/AddTask";
import styled from "styled-components";
import { Button } from "@material-ui/core";

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
  const postTask = async (e: any, task: Task, arrOfStudentsIds: string[]) => {};
  const [students, setStudents] = useRecoilState(teacherStudents);
  const [open, setOpen] = useState<boolean>(false);
  //@ts-ignore
  const { user } = useContext(AuthContext);
  const classes = useStyles();

  const [task, setTask] = useState<Task>({
    createdBy: user.id,
    endDate: new Date(),
    title: "",
    type: "manual",
    status: "active",
  });
  const [studentsToTask, setStudentsToTask] = useState<number[]>([]);

  const handleTaskChange = (element: string, index: number, change: any) => {
    switch (element) {
      case "title":
        setTask((prev) => ({ ...prev, title: change }));
        break;
      case "date":
        setTask((prev) => ({ ...prev, date: change }));
        break;
      case "externalLink":
        setTask((prev) => ({ ...prev, externalLink: change }));
        break;
      case "type":
        setTask((prev) => ({ ...prev, type: change }));
        break;
      case "body":
        setTask((prev) => ({ ...prev, body: change }));
        break;
      case "endDate":
        setTask((prev) => ({ ...prev, endDate: change }));
        break;
      case "status":
        setTask((prev) => ({ ...prev, status: change }));
        break;
      case "students":
        const prevStudents = studentsToTask.slice();
        const studentALreadyExistsIndex = prevStudents.findIndex(
          (id) => change[1] === id
        );
        if (studentALreadyExistsIndex > -1) {
          prevStudents.splice(studentALreadyExistsIndex, 1);
          setStudentsToTask(prevStudents);
        } else {
          setStudentsToTask((prev) => [
            ...prev,
            change.filter((e: any) => !isNaN(e))[0],
          ]);
        }
        break;
    }
  };

  const handleRemove = () => {
    setOpen(false);
    setTask({
      createdBy: user.id,
      endDate: new Date(),
      title: "",
      type: "menual",
      status: "active",
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    //@ts-ignore
    <div style={modalStyle} className={classes.paper}>
      <AddTask
        students={students}
        handleRemove={handleRemove}
        handleChange={handleTaskChange}
        task={task}
        studentsToTask={studentsToTask}
      />
      {/* @ts-ignore */}
      <Button variant='contained' onClick={postTask}>
        add task
      </Button>
    </div>
  );
  const fetchStudents = async () => {
    try {
      const { data: teacherStudents } = await network.get(
        `/api/v1/student/byTeacher/${user.id}`
      );
      const allStudents = teacherStudents.map(
        (classRoom: any) => classRoom.Class.Students
      );
      setStudents(allStudents[0]); //TODO check eith multipal classes
    } catch {}
  };

  useEffect(() => {
    (async () => {
      await fetchStudents();
    })();
  }, []);

  return (
    <div>
      <AddCircleIcon onClick={() => setOpen(true)} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        {body}
      </Modal>
      <TeacherTaskBoard />
    </div>
  );
}

const modalStyle = {
  top: `50%`,
  left: `50%`,
  transform: `translate(-${50}%, -${50}%)`,
  overflowY: "scroll",
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);
