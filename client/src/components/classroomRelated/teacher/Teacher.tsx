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
import { Button, Typography } from "@material-ui/core";
import Swal from "sweetalert2";
import { IClass, IStudent, ITask } from "../../../typescript/interfaces";
import { Center, H1, TitleWrapper } from "../../../styles/styledComponents";
import { relative } from "path";
import { Loading } from "react-loading-wrapper";
import { flatMap } from "lodash";

const GlobalStyle = createGlobalStyle`
  .swal2-container {
    z-index:100000000000000
  }
`;

export default function Teacher() {
  const getBaseTask = (): ITask => ({
    createdBy: user.id,
    endDate: new Date(),
    title: "",
    externalLink: "",
    type: "manual",
    status: "active",
  });

  const postTask = async () => {
    if (!task.title) return Swal.fire("Error", "title is required", "error");
    if (studentsToTask.length === 0)
      return Swal.fire("Error", "no student selected", "error");
    try {
      task.createdBy = user.id;
      await network.post("/api/v1/task/tostudents", {
        ...task,
        idArr: studentsToTask,
      });
      Swal.fire("Success", "task added successfully", "success").then((_) =>
        window.location.assign("/tasks")
      );
      handleClose(true);
      //@ts-ignore
    } catch (e) {
      Swal.fire("Error", e.message, "error");
    }
  };
  const students = useRecoilValue(teacherStudents);
  const classesToTeacher = useRecoilValue(classesOfTeacher);

  const [open, setOpen] = useState<boolean>(false);
  //@ts-ignore
  const { user } = useContext(AuthContext);
  const classes = useStyles();

  const [task, setTask] = useState<ITask>(getBaseTask());
  const [studentsToTask, setStudentsToTask] = useState<number[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    network.get("/api/v1/event/updates").then((data: any) => {
      setLoaded(data.data.success);
    });
  }, []);

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
      case "externalId":
        setTask((prev) => ({ ...prev, externalId: change }));
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
        setStudentsToTask(
          flatMap(change, (clsArr: number[]) =>
            clsArr.slice(1).filter((cell) => !!cell)
          )
        );
    }
  };

  const handleRemove = () => {
    setOpen(false);
    setTask({
      createdBy: user.id,
      endDate: new Date(),
      title: "",
      type: "manual",
      status: "active",
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (taskAdded?: any) => {
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
        // studentsToTask={studentsToTask}
        teacherClasses={classesToTeacher}
      />
      <Button variant='contained' onClick={postTask}>
        add task
      </Button>
    </div>
  );

  return (
    <Loading loading={!loaded}>
      <Typography
        variant='h2'
        style={{
          marginRight: 15,
          marginTop: "2%",
          marginBottom: "auto",
          marginLeft: "15%",
        }}>
        Tasks
      </Typography>
      <StyledButton
        onClick={handleOpen}
        style={{ marginLeft: "auto", marginRight: "15%", height: "auto" }}>
        New Task
        <AddCircleIcon
          style={{ fontSize: "1.3em", marginLeft: "0.5vw" }}
        />{" "}
      </StyledButton>
      <div
        style={{
          minHeight: "50vh",
          marginTop: "5vh",
          marginLeft: "auto",
          marginRight: "auto",
          width: "70%",
        }}>
        <TeacherTaskBoard user={user} />

        <GlobalStyle />

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'>
          {body}
        </Modal>
      </div>
    </Loading>
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

export const StyledButton = styled.div`
  /* position: absolute; */
  background-color: rgb(22, 121, 30);
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  padding: 10px;
  margin: 2vh 0;
  border-radius: 5px;
  font-size: 1.2em;
  color: white;
  /* bottom: -10vh; */
  /* left: 2vw; */
  box-shadow: 0 4px 4px 2px rgba(10, 12, 19, 0.78);
  cursor: pointer;
  transition: 0.1s ease-in-out;

  :hover {
    transform: translate(4px, 0);
  }
`;
