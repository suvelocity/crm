import React from "react";
import { Switch, Route } from "react-router-dom";
import "react-loading-wrapper/dist/index.css";
import ErrorBoundary from "../helpers/ErrorBoundary";
import Dashboard from '../components/classroomRelated/dashboard/Dashboard';
import Lessons from '../components/classroomRelated/lessons/Lessons';
import Schedhule from '../components/classroomRelated/schedhule/Schedhule'
import Tasks from '../components/classroomRelated/tasks/Tasks';
import ClassRoomNavBar from '../components/ClassRoomNavBar';
export function StudentRoutes() {
  return (
    <>
      <ErrorBoundary>
        <ClassRoomNavBar/>
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
          <Route path="*">
            <div>404 Not Found</div>
          </Route>
        </Switch>
      </ErrorBoundary>
  </>
  );
}
