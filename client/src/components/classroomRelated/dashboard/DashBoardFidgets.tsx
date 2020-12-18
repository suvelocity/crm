import { AxiosResponse } from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { ILesson, ITask } from "../../../../../server/types";
import { AuthContext } from "../../../helpers";
import network from "../../../helpers/network";
import styled from "styled-components";
import {
  TitleWrapper,
  H1,
  Wrapper,
  Center,
} from "../../../styles/styledComponents";
import sunshine from "../../../media/sunshine.gif";
const mockTasks = [
  {
    body: "Build challenge app",
    deadline: new Date(),
    status: "pending",
    by: "Guy",
  },
  {
    body: "Spotify app",
    deadline: new Date(),
    status: "done",
    by: "Nir",
  },
  {
    body: "rebuild challengeMe",
    deadline: new Date(),
    status: "done",
    by: "Tomer",
  },
  {
    body: "Break into Penthagon's servers",
    deadline: new Date(),
    status: "done",
    by: "Rotem",
  },
  {
    body: "Break into Penthagon's servers",
    deadline: new Date(),
    status: "done",
    by: "Rotem",
  },
  {
    body: "Break into Penthagon's servers",
    deadline: new Date(),
    status: "done",
    by: "Rotem",
  },
  {
    body: "Break into Penthagon's servers",
    deadline: new Date(),
    status: "done",
    by: "Rotem",
  },
  {
    body: "Break into Penthagon's servers",
    deadline: new Date(),
    status: "done",
    by: "Rotem",
  },
  {
    body: "Break into Penthagon's servers",
    deadline: new Date(),
    status: "done",
    by: "Rotem",
  },
  {
    body: "Break into Penthagon's servers",
    deadline: new Date(),
    status: "done",
    by: "Rotem",
  },
  {
    body: "Break into Penthagon's servers",
    deadline: new Date(),
    status: "done",
    by: "Rotem",
  },
  {
    body: "Break into Penthagon's servers",
    deadline: new Date(),
    status: "done",
    by: "Rotem",
  },
  {
    body: "Break into Penthagon's servers",
    deadline: new Date(),
    status: "done",
    by: "Rotem",
  },
  {
    body: "Break into Penthagon's servers",
    deadline: new Date(),
    status: "done",
    by: "Rotem",
  },
  {
    body: "Break into Penthagon's servers",
    deadline: new Date(),
    status: "done",
    by: "Rotem",
  },
  {
    body: "Break into Penthagon's servers",
    deadline: new Date(),
    status: "done",
    by: "Rotem",
  },
  {
    body: "Break into Penthagon's servers",
    deadline: new Date(),
    status: "done",
    by: "Rotem",
  },
  {
    body: "Break into Penthagon's servers",
    deadline: new Date(),
    status: "done",
    by: "Rotem",
  },
];

export function TasksFidget() {
  const [incompletedTasks, setIncompletedTasks] = useState<ITask[]>([]);

  const { user } = useContext<any>(AuthContext);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks: () => Promise<void> = async () => {
    try {
      const { data: allTasks }: { data: ITask[] } = await network.get(
        `/api/v1/task/bystudentid/${user.id}`
      );

      setIncompletedTasks(
        allTasks.filter((task: ITask) => task.status !== "done")
      );
    } catch (e) {
      console.log(e);
    }
  };
  console.log(incompletedTasks);

  return (
    <Wrapper style={{ height: "100%" }}>
      <Center>
        <TitleWrapper>
          <Headline>My Tasks</Headline>
        </TitleWrapper>

        {incompletedTasks === [] ? (
          <p>
            <b>you have incommpleted Tasks!</b>

            {incompletedTasks.map((task: ITask, i: number) => (
              <li key={`incompTask${i}`}>{task.body}</li>
            ))}
          </p>
        ) : (
          <img
            src={sunshine}
            alt='sunshine'
            style={{
              maxHeight: "100px",
            }}
          />
        )}
      </Center>
    </Wrapper>
  );
}

const mockLessons = [
  {
    title: "React basics",
    Teacher: "Guy",
    time: "9:30",
  },
];
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
      settodayLessons((mockLessons as unknown) as ILesson[]);
    }
  };

  return (
    <Wrapper style={{ height: "100%" }}>
      <Center>
        <TitleWrapper>
          <Headline>Lessons</Headline>
        </TitleWrapper>
      </Center>
      <p>
        {todayLessons.map((lesson: any, i: number) => (
          <li key={`lsn${i}`}>{lesson.title}</li>
        ))}{" "}
      </p>
    </Wrapper>
  );
}

export function ScheduleFidget() {
  return (
    <Wrapper style={{ height: "60%" }}>
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
