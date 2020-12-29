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
  Center,
  StyledAtavLink,
} from "../../../styles/styledComponents";
import sunshine from "../../../media/sunshine.gif";
import LinkIcon from "@material-ui/icons/Link";
import ListItemComponent from "./ListItem";
import List from "@material-ui/core/List";
import { Typography } from "@material-ui/core";

export function TasksFidget() {
  const [incompletedTasks, setIncompletedTasks] = useState<ITaskofStudent[]>();

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
    <>
      <Typography
        variant='h3'
        style={{
          marginRight: 15,
          marginTop: "2%",
          marginBottom: "auto",
          marginLeft: "12.5%",
        }}>
        Unfinished Tasks
      </Typography>
      <Wrapper style={{ height: "100%" }}>
        {/* <TitleWrapper>
        <Headline>Unfinished Tasks</Headline>
      </TitleWrapper> */}

        {incompletedTasks ? (
          incompletedTasks.length !== 0 ? (
            <div style={{ lineHeight: "2em", fontSize: "1.1em" }}>
              {/* <h2 style={{ color: "red" }}>You Have Incomplete Tasks!</h2> */}
              <List>
                {incompletedTasks.map((
                  task: any,
                  i: number //todo change intefacce
                ) => (
                  <ListItemComponent
                    key={`incompTask${i}`}
                    task={task.Task}></ListItemComponent>
                ))}
              </List>
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
          )
        ) : null}
      </Wrapper>
    </>
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
    <>
      <Typography
        variant='h3'
        style={{
          marginRight: 15,
          marginTop: "2%",
          marginBottom: "auto",
          marginLeft: "12.5%",
        }}>
        Last Lesson
      </Typography>
      <Wrapper style={{ height: "100%" }}>
        {todayLessons?.map((lesson: any, i: number) => (
          <div
            className='infoData'
            style={{
              lineHeight: "2em",
              fontSize: "1.1em",
              overflowY: "auto",
              maxWidth: "100%",
            }}>
            <h2>{lesson.title}</h2>

            <div
              className='today-info'
              style={{ display: "flex", flexDirection: "column" }}>
              <div
                className='today-info'
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "fit-content",
                  height: "100%",
                }}>
                <h3>Resources</h3>
                <ResourcesLinks>
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
                </ResourcesLinks>
              </div>
              <div
                className='today-info'
                style={{
                  display: "flex",
                  flexDirection: "column",
                  maxWidth: "100%",
                  height: "100%",
                  // textAlign: "start",
                }}>
                <h3>Tasks</h3>
                <List>
                  {lesson.Tasks.map((task: any) => (
                    <ListItemComponent task={task}></ListItemComponent>
                  ))}
                </List>
                <p>
                  flexDirectionflexDirectionflexDirectionflexDirectionflexDirectionflex
                  DirectionflexDirectionflexDirectionflexDirectionflexDirectionflexDirectionflexDirectionflexDirectionf
                  lexDirectionflexDirectionflexDirectionflexDirectionflexDirectionflexDirectionflexDirectionf
                  lexDirectionflexDirectionflexDirectionflexDirectionflexDirection
                </p>
              </div>
            </div>
          </div>
        ))}
      </Wrapper>
    </>
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
  width: 75%;
  margin-left: auto;
  margin-right: auto;
  padding: 10px 20px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 27px;
  color: white;
  /* margin: 0; */
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

const ResourcesLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 5px;
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
  overflow-y: scroll;
  /* 
  -ms-overflow-style: auto; */

  /* height: 80%; */
  /* position: relative; */
`;
