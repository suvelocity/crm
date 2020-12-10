import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "react-loading-wrapper/dist/index.css";
import ErrorBoundary from "../../helpers/ErrorBoundary";
import Dashboard from './dashboard/Dashboard';
import Lessons from './lessons/Lessons';
import Schedhule from './schedhule/Schedhule'
import Tasks from './tasks/Tasks';
import Teacher from './teacher/Teacher';

export default function SingleClassroom() {
 
    return (
      <>
      <Router>
        <ErrorBoundary>
          <Switch>
            <Route exact path="/">
              <h1 style={{ textAlign: "center" }}>Welcome to Classroom</h1>
            </Route>
            <Route path="/classroom/dashboard">
              <Dashboard />
            </Route>
            <Route path="/classroom/lessons">
              <Lessons />
            </Route>
            <Route path="/classroom/schedhule">
              <Schedhule />
            </Route>
            <Route path="/classroom/tasks">
              <Tasks />
            </Route>
            <Route path="/classroom/teacher">
              <Teacher />
            </Route>
            <Route path="*">
              <div>404 Not Found</div>
            </Route>
          </Switch>
        </ErrorBoundary>
      </Router>
    </>
    )
}
