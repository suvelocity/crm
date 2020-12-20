import React, { useState, useEffect, useContext } from "react";
import TeacherTaskBoard from "./TeacherTaskBoard";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { AuthContext } from "../../../helpers";
import network from "../../../helpers/network";
import { useRecoilValue } from "recoil";
import { teacherStudents, classesOfTeacher } from "../../../atoms";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import AddTask from "../lessons/AddTask";
import styled, { createGlobalStyle } from "styled-components";
import { Button } from "@material-ui/core";
import Swal from "sweetalert2";
import { IClass, IStudent } from "../../../typescript/interfaces";
import { relative } from "path";

const GlobalStyle = createGlobalStyle`
  .swal2-container {
    z-index:100000000000000
  }
`;

interface Task {
  lessonId?: number;
  externalId?: number;
  externalLink?: string;
  createdBy: number;
  endDate: Date;
  type: string;
  title: string;
  body?: string;
  status: "active" | "disabled";
}

export default function Teacher() {
  const getBaseTask = (): Task => ({
    createdBy: user.id,
    endDate: new Date(),
    title: "",
    type: "manual",
    status: "active",
  });

  const postTask = async () => {
    if (!task.title) return Swal.fire("Error", "title is required", "error");
    if (studentsToTask.length === 0)
      return Swal.fire("Error", "no student selected", "error");
    try {
      await network.post("/api/v1/task/tostudents", {
        ...task,
        idArr: studentsToTask,
      });
      Swal.fire("Success", "task added successfully", "success");
      handleClose();
    } catch {}
  };
  const students = useRecoilValue(teacherStudents);
  const classesToTeacher = useRecoilValue(classesOfTeacher);

  const [open, setOpen] = useState<boolean>(false);
  //@ts-ignore
  const { user } = useContext(AuthContext);
  const classes = useStyles();

  const [task, setTask] = useState<Task>(getBaseTask());
  const [studentsToTask, setStudentsToTask] = useState<number[]>(
    students.map((student: IStudent) => student!.id!)
  );

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
    setTask(getBaseTask());
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
      <Button variant='contained' onClick={postTask}>
        add task
      </Button>
    </div>
  );

  return (
    <div
      style={{
        position: "relative",
        minHeight: "50vh",
        marginTop: "5vh",
        marginLeft: "auto",
        marginRight: "auto",
        width: "90%",
      }}>
      <TeacherTaskBoard user={user} />
      <StyledButton onClick={() => setOpen(true)}>
        <AddCircleIcon style={{ fontSize: "1.3em", marginRight: "0.5vw" }} />{" "}
        New Taskasdasdasd
      </StyledButton>
      <GlobalStyle />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'>
        {body}
      </Modal>
    </div>
  );
}

const TeacherContainer = styled.div`
  color: ${({ theme }: { theme: any }) => theme.colors.font};
  background-color: ${({ theme }: { theme: any }) => theme.colors.background};
  height: 100vh;
  width: 90%;
  overflow: hidden;
  margin-left: auto;
  margin-right: auto;
`;

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

const StyledButton = styled.div`
  position: absolute;
  background-color: rgb(65, 85, 181);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  font-size: 2em;
  color: white;
  bottom: -10vh;
  left: 2vw;
  box-shadow: 0 4px 4px 2px rgba(10, 12, 19, 0.78);
  cursor: pointer;
  transition: 0.1s ease-in-out;

  :hover {
    transform: translate(4px, 0);
  }
`;
