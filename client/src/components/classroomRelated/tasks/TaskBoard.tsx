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

export default function TaskBoard() {
  const [finishedTasks, setFinishedTasks] = useState<ITask[] | null>();
  const [unfinishedTasks, setUnfinishedTasks] = useState<ITask[] | null>();
  const [loading, setLoading] = useState<boolean>(true);
  //@ts-ignore
  const { user } = useContext(AuthContext);

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
  console.log(unfinishedTasks);

  return (
    <DashboardContainer>
      <Content>
        <Loading size={30} loading={loading}>
          <Carus showArrows={true}>
            {/* <Nofitication myTasks={myTasks} /> */}
            {unfinishedTasks?.map((unfinishedTask: any) => (
              <SingleTask task={unfinishedTask} />
            ))}
          </Carus>
          <h2>History </h2>
          <TaskTable myTasks={finishedTasks} />
        </Loading>
      </Content>
    </DashboardContainer>
  );
}
