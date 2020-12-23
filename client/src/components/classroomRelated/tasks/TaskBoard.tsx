import React, { useState, useEffect, useCallback, useContext } from "react";
import { ITask, ITaskofStudent } from "../../../typescript/interfaces";
import { Loading } from "react-loading-wrapper";
import Swal from "sweetalert2";
import network from "../../../helpers/network";
import Button from "@material-ui/core/Button";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { AuthContext } from "../../../helpers";
import styled from "styled-components";
import TaskTable from "./TaskTable";
import Nofitication from "./Nofitication";
import SingleTask from "./SingleTask";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Modal from "@material-ui/core/Modal";
import Submit from "./Submit";

export default function TaskBoard() {
  const [finishedTasks, setFinishedTasks] = useState<ITask[] | null>();
  const [unfinishedTasks, setUnfinishedTasks] = useState<ITask[] | null>();
  const [loading, setLoading] = useState<boolean>(true);
  //@ts-ignore
  const { user } = useContext(AuthContext);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [c] = React.useState(getModalStyle);
  const [currentTask, setCurrentTask] = useState<number>();

  const DashboardContainer = styled.div`
    background-color: ${({ theme }: { theme: any }) => theme.colors.background};
    width: 100%;
    height: 100vh;
  `;

  const Carus = styled(Carousel)`
    background-color: ${({ theme }: { theme: any }) => theme.colors.background};
    width: 36%;
    border-radius: 10px;
    margin-left: auto;
    margin-right: auto;
    /* margin-top: 5vh; */
    margin-bottom: 5vh;
  `;
  const Content = styled.div`
    color: ${({ theme }: { theme: any }) => theme.colors.font};
  `;

  const getMyTasks = async () => {
    try {
      const { data }: { data: ITask[] } = await network.get(
        `/api/v1/task/bystudentid/${user.id}`
      );

      setFinishedTasks(() => {
        const finished = data.filter((task: any) => {
          return task.status === "done";
        });
        return finished;
      });
      setUnfinishedTasks(() => {
        const unfinished = data.filter((task: any) => {
          return task.status !== "done";
        });
        return unfinished;
      });
      setLoading(false);
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
  };

  useEffect(() => {
    try {
      getMyTasks();
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
    //eslint-disable-next-line
  }, []);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = (currentId: number) => {
    setOpen(true);
    setCurrentTask(currentId);
  };

  //modal and submit
  const handleSubmit = async (url: string) => {
    try {
      const { data } = await network.put(`/api/v1/task/submit/${currentTask}`, {
        url: url,
      });
      handleClose();
      if (data.error) {
        Swal.fire("Error Occurred", data.error, "error");
      }
    } catch (error) {
      handleClose();
      Swal.fire("Error Occurred", error.message, "error");
    }
  };

  const body = (
    //@ts-ignore
    <div style={modalStyle} className={classes.paper}>
      <Submit setOpen={setOpen} handleSubmit={handleSubmit} />
    </div>
  );

  return (
    <DashboardContainer>
      <Content>
        <Loading size={30} loading={loading}>
          <Carus showArrows={true}>
            {unfinishedTasks ? (
              unfinishedTasks?.map((unfinishedTask: any) => (
                <SingleTask
                  task={unfinishedTask}
                  handleOpen={handleOpen}
                  handleClose={handleClose}
                />
              ))
            ) : (
              <h1>no tasks</h1>
            )}
          </Carus>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby='simple-modal-title'
            aria-describedby='simple-modal-description'>
            {body}
          </Modal>
          <h2>History </h2>
          <TaskTable myTasks={finishedTasks} />
        </Loading>
      </Content>
    </DashboardContainer>
  );
}

//modal
function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      color: `${({ theme }: { theme: any }) => theme.colors.font}`,
    },
  })
);
export const modalStyle = {
  top: `50%`,
  left: `50%`,
  transform: `translate(-${50}%, -${50}%)`,
  overflowY: "scroll",
  zIndex: 20,
};
