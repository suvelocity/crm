import { AxiosResponse } from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  ILesson,
  ITask,
  ITaskofStudent,
} from "../../../../../server/src/types";
import { AuthContext } from "../../../helpers";
import network from "../../../helpers/network";
import styled from "styled-components";
import {
  TitleWrapper,
  H1,
  Wrapper,
  Center,
  StyledAtavLink,
} from "../../../styles/styledComponents";
import sunshine from "../../../media/sunshine.gif";
import LinkIcon from "@material-ui/icons/Link";

export function TasksFidget() {
  const [incompletedTasks, setIncompletedTasks] = useState<ITaskofStudent[]>(
    []
  );

  const { user } = useContext<any>(AuthContext);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks: () => Promise<void> = async () => {
    try {
      const { data: allTasks }: { data: ITaskofStudent[] } = await network.get(
        `/api/v1/task/bystudentid/${user.id}`
      );

      setIncompletedTasks(
        allTasks.filter((task: ITaskofStudent) => task.status !== "done")
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Wrapper style={{ height: "100%" }}>
      <Center>
        <TitleWrapper>
          <Headline>My Tasks</Headline>
        </TitleWrapper>
      </Center>

      {incompletedTasks.length !== 0 ? (
        <div style={{ lineHeight: "2em", fontSize: "1.1em" }}>
          <h2 style={{ color: "red" }}>You Have Incomplete Tasks!</h2>

          {incompletedTasks.map((task: ITaskofStudent, i: number) => (
            <li key={`incompTask${i}`}>
              {/* @ts-ignore */}
              {task.Task.title}, from {task.Task.Lesson.title} lesson,{" "}
              {/* @ts-ignore */}
              {task.Task.type}
              {/* @ts-ignore */}
              <StyledAtavLink href={task.Task.externalLink}>
                <LinkIcon />
              </StyledAtavLink>
            </li>
          ))}
        </div>
      ) : (
        <Center>
          <img
            src={sunshine}
            alt="sunshine"
            style={{
              maxHeight: "100px",
            }}
          />
        </Center>
      )}
    </Wrapper>
  );
}

export function LessonsFidget() {
  const [todayLessons, settodayLessons] = useState<ILesson[]>([]);
  const { user } = useContext<any>(AuthContext);

  useEffect(() => {
    fetchLesson();
  }, []);

  const fetchLesson: () => Promise<void> = async () => {
    try {
      const { data: allLessons }: { data: ILesson[] } = await network.get(
        `/api/v1/lesson/byclass/${user.classId}`
      );
      settodayLessons(allLessons);
    } catch (e) {
      console.log(e);
    }
  };

  console.log(todayLessons);
  return (
    <Wrapper style={{ height: "100%" }}>
      <Center>
        <TitleWrapper>
          <Headline>Lessons</Headline>
        </TitleWrapper>
      </Center>
      <div style={{ lineHeight: "2em", fontSize: "1.3em" }}>
        {todayLessons.map((lesson: any, i: number) => (
          <li key={`lsn${i}`}>
            <>{lesson.title}</>, with{" "}
            <>
              {lesson.Teacher.firsnName} {lesson.Teacher.lastName}
            </>
          </li>
        ))}{" "}
      </div>
    </Wrapper>
  );
}

export function ScheduleFidget() {
  return (
    <Wrapper style={{ height: "100%" }}>
      <Center>
        <TitleWrapper>
          <Headline>Schedule</Headline>
        </TitleWrapper>
      </Center>
      <p>checkpoint 16:00</p>
    </Wrapper>
  );
}
export const Headline = styled.h1`
  padding: 10px 20px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 27px;
  color: white;
  /* position: relative; */
  /* left: -50%;
  top: -80px; */
  margin: 0;
  display: inline;
  background-color: ${({ theme }: { theme: any }) => theme.colors.item};
  border-radius: 5px;
  min-width: 180px;
  box-shadow: 5px 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
  z-index: 2;
`;
