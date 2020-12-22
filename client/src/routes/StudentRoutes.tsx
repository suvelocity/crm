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
export function StudentRoutes() {
  return (
    <>
      <ErrorBoundary>
        <ClassRoomNavBar />
        <div style={{ flexGrow: 1 }}>
          <Switch>
            <Route exact path="/">
              <Dashboard />
            </Route>
            <Route path="/lessons">
              <Lessons />
            </Route>
            <Route path="/schedhule">
              <Schedhule />
            </Route>
            <Route path="/tasks">
              <Tasks />
            </Route>
            <Route path="/quizme">
              <QuizMe />
            </Route>
            <Route path="/tasks">
              <Tasks />
            </Route>
            <Route path="/quizme">
              <QuizMe />
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
