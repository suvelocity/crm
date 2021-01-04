import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import "react-loading-wrapper/dist/index.css";
import ErrorBoundary from "../helpers/ErrorBoundary";
import StudentDashboard from "../components/classroomRelated/dashboard/StudentDashBoard";
import Lessons from "../components/classroomRelated/lessons/Lessons";
import Tasks from "../components/classroomRelated/tasks/TaskBoard";
import ClassRoomNavBar from "../components/ClassRoomNavBar";
import QuizMe from "../components/classroomRelated/QuizMeRelated/QuizMe";
import PairMeetings from "../components/mentorRelated/Meetings/PairMeetings";
import styled, { createGlobalStyle } from "styled-components";

import { AuthContext } from "../helpers";
import Home from "../components/classroomRelated/QuizMeRelated/components/pages/Home";
import FormRouter from "../components/classroomRelated/QuizMeRelated/components/FormRouter";
import FormCreator from "../components/classroomRelated/QuizMeRelated/components/pages/FormCreation/FormCreator";
import QuizSubmissionsRouter from "../components/classroomRelated/QuizMeRelated/components/QuizSubmissionsRouter";

const GlobalStyle = createGlobalStyle`
body{
  background-color: ${({ theme }: { theme: any }) => theme.colors.background};
  color: ${({ theme }: { theme: any }) => theme.colors.font};
  .swal2-container {
    z-index:100000000000000
  }
}
`;
export function StudentRoutes() {
  //@ts-ignore
  const { user } = useContext(AuthContext);
  const { userType } = user;

  return (
    <>
      <ErrorBoundary>
        <GlobalStyle />
        <ClassRoomNavBar />
        <div style={{ flexGrow: 1 }}>
          <Switch>
            <Route exact path="/">
              <StudentDashboard />
            </Route>
            <Route path="/lessons">
              <Lessons />
            </Route>
            <Route path="/quizme/form/:id" component={FormRouter} />
            <Route path="/tasks">
              <Tasks />
            </Route>
            <Route exact path="/quizme" component={Home} />
            <Route path="/mentor/:id">
              <PairMeetings />
            </Route>
            <Route path="*">
              <div>404 Not Found</div>
            </Route>
          </Switch>
        </div>
      </ErrorBoundary>
    </>
  );
}
