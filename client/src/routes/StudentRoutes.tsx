import React from "react";
import { Switch, Route } from "react-router-dom";
import "react-loading-wrapper/dist/index.css";
import ErrorBoundary from "../helpers/ErrorBoundary";
import Dashboard from "../components/classroomRelated/dashboard/Dashboard";
import Lessons from "../components/classroomRelated/lessons/Lessons";
import Schedhule from "../components/classroomRelated/schedhule/Schedhule";
import Tasks from "../components/classroomRelated/tasks/TaskBoard";
import ClassRoomNavBar from "../components/ClassRoomNavBar";
import QuizMe from "../components/classroomRelated/QuizMeRelated/QuizMe";
import PairMeetings from "../components/mentorRelated/Meetings/PairMeetings";
import styled, { createGlobalStyle } from "styled-components";

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
  return (
    <>
      <ErrorBoundary>
        <GlobalStyle />
        <ClassRoomNavBar />
        <div style={{ flexGrow: 1 }}>
          <Switch>
            <Route exact path='/'>
              <Dashboard />
            </Route>
            <Route path='/lessons'>
              <Lessons />
            </Route>
            <Route path='/schedhule'>
              <Schedhule />
            </Route>
            <Route path='/quizme'>
              <QuizMe />
            </Route>
            <Route path='/tasks'>
              <Tasks />
            </Route>
            <Route path='/quizme'>
              <QuizMe />
            </Route>
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
