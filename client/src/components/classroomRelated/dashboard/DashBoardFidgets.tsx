import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  ILesson,
  ITaskofStudent,
} from "../../../typescript/interfaces";
import { AuthContext } from "../../../helpers";
import network from "../../../helpers/network";
import styled from "styled-components";
import {
  TitleWrapper,
  Center,
  StyledAtavLink,
} from "../../../styles/styledComponents";
import sunshine from "../../../media/sunshine.gif";
import LinkIcon from "@material-ui/icons/Link";

export function TasksFidget() {
  const [incompletedTasks, setIncompletedTasks] = useState<ITaskofStudent[]>([]);

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
          <Headline>Unfinished Tasks</Headline>
        </TitleWrapper>
      </Center>

      {incompletedTasks?.length !== 0 ? (
        <div
          style={{ lineHeight: "2em", fontSize: "1.1em", textAlign: "center" }}>
          <h2 style={{ color: "red" }}>You Have Incomplete Tasks!</h2>

          {incompletedTasks.map((task: ITaskofStudent, i: number) => (
            <li key={`incompTask${i}`}>
              {/* @ts-ignore */}
              {task.Task.title}, to finish by {/* @ts-ignore */}
              {task.Task.endDate.substring(0, 10)} {/* @ts-ignore */}
              <StyledAtavLink href={task.Task?.externalLink}>
                <LinkIcon />
              </StyledAtavLink>
            </li>
          ))}
        </div>
      ) : (
        <Center>
          <img
            src={sunshine}
            alt='sunshine'
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
      const { data: latestLesson }: { data: ILesson[] } = await network.get(
        `/api/v1/lesson/byclass/today/${user.classId}`
      );
      settodayLessons(latestLesson);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Wrapper style={{ height: "100%" }}>
      <Center>
        <TitleWrapper>
          <Headline>Last Lesson</Headline>
        </TitleWrapper>
      </Center>
      {todayLessons?.map((lesson: any, i: number) => (
        <div
          className='infoData'
          style={{
            lineHeight: "2em",
            fontSize: "1.1em",
            textAlign: "center",
          }}>
          {console.log(lesson)}
          <h2>{lesson.title}</h2>

          <div
            className='today-info'
            style={{ display: "flex", justifyContent: "space-around" }}>
            <div
              className='today-info'
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "50%",
                textAlign: "start",
                // overflowY: "auto",
                // maxHeight: "30px",
              }}>
              <h3>Resources</h3>
              {lesson.resource?.includes("%#splitingResource#%")
                ? lesson.resource
                    .split("%#splitingResource#%")
                    .map((resource: string, index: number) => (
                      <ResourcesLink key={index}>
                        <Link target='_blank' href={resource}>
                          {resource}
                        </Link>
                      </ResourcesLink>
                    ))
                : //@ts-ignore
                  lesson.resource?.length > 0 && (
                    //@ts-ignore
                    <Link target='_blank' href={lesson.resource}>
                      {lesson.resource}
                    </Link>
                  )}
            </div>
            <div
              className='today-info'
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "50%",
                textAlign: "start",
              }}>
              <h3>Tasks</h3>
              {lesson.Tasks.map((task: any) => (
                <li>{task.title}</li>
              ))}
            </div>
          </div>
        </div>
      ))}
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

const ResourcesLink = styled.div`
  margin-top: 15px;
`;

const Link = styled.a`
  background-color: #0a1425;
  text-decoration: none;
  color: ${({ theme }: { theme: any }) => theme.colors.font};
  border-radius: 8px;
  padding: 5px;
  color: white;
`;

const Wrapper = styled.div`
  margin: ${(props: { margin: string }) =>
    props.margin ? props.margin : "5% auto"};
  width: 80%;
  padding: ${(props: { padding: string }) =>
    props.padding ? props.padding : "40px"};
  border-radius: 7px;
  box-shadow: 5px 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
  min-width: 300px;
  max-width: ${(props: { width: string }) =>
    props.width ? props.width : "700px"};
  background-color: ${(props: { backgroundColor: string }) =>
    props.backgroundColor ? props.backgroundColor : "white"};
  color: ${(props: { color: string }) => (props.color ? props.color : "black")};
  /* position: relative; */
`;
