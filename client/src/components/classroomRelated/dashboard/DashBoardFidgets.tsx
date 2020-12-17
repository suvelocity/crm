import { AxiosResponse } from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { ILesson, ITask } from "../../../../../server/types";
import { AuthContext } from "../../../helpers";
import network from "../../../helpers/network";
import {
  TitleWrapper,
  H1,
  Wrapper,
  Center,
} from "../../../styles/styledComponents";
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
];

export function TasksFidget() {
  const [completedTasks, setCompletedTasks] = useState<ITask[]>([]);
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
      //only for now, for style purposes.
      if (allTasks[0]) {
        setCompletedTasks(
          allTasks.filter((task: ITask) => task.status === "done")
        );
        setIncompletedTasks(
          allTasks.filter((task: ITask) => task.status !== "done")
        );
      } else {
        setIncompletedTasks(
          //@ts-ignore
          mockTasks.filter((task: Itask) => task.status === "done")
        );
        setCompletedTasks(
          //@ts-ignore
          mockTasks.filter((task: ITask) => task.status !== "done")
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Wrapper style={{ height: "60%" }}>
      <Center>
        <TitleWrapper>
          <H1>Tasks</H1>
        </TitleWrapper>
      </Center>
      <p>
        <b>Completed Tasks</b>
        {completedTasks.map((task: ITask, i: number) => (
          <li key={`compTask${i}`}>{task.body}</li>
        ))}
        <b>Incompleted Tasks</b>
        {incompletedTasks.map((task: ITask, i: number) => (
          <li key={`incompTask${i}`}>{task.body}</li>
        ))}
      </p>
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
    <Wrapper style={{ height: "60%" }}>
      <Center>
        <TitleWrapper>
          <H1>Lessons</H1>
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
          <H1>Schedule</H1>
        </TitleWrapper>
      </Center>
      <p>checkpoint 16:00</p>
    </Wrapper>
  );
}
