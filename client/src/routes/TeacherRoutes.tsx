import React from "react";
import { Switch, Route } from "react-router-dom";
import "react-loading-wrapper/dist/index.css";
import ErrorBoundary from "../helpers/ErrorBoundary";
import Dashboard from "../components/classroomRelated/dashboard/Dashboard";
import Lessons from "../components/classroomRelated/lessons/Lessons";
import Schedhule from "../components/classroomRelated/schedhule/Schedhule";
import TaskBoard from "../components/classroomRelated/tasks/TaskBoard";
import Teacher from "../components/classroomRelated/teacher/Teacher";
import ClassRoomNavBar from "../components/ClassRoomNavBar";
import QuizMe from '../components/classroomRelated/QuizMeRelated/QuizMe'
import QuizPage from '../components/classroomRelated/QuizMeRelated/components/QuizPage'


export default function TeacherRoutes() {
  return (
    <ErrorBoundary>
      <ClassRoomNavBar />
      {/* <div id='classroom-container' style={{display:"flex"}} > */}
      <div id='interface-container' style={{ flexGrow: 1 }}>
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
          <Route path='/tasks'>
            <TaskBoard />
          </Route>
          <Route path='/teacher'>
            <Teacher />
          </Route>
          <Route exact path="/quizme">
            <QuizMe />
          </Route>
          <Route exact path="/quizme/quiz/:id">
            <QuizPage />
          </Route>
          <Route path='*'>
            <div>404 Not Found</div>
          </Route>
        </Switch>
      </div>
      {/* </div> */}
    </ErrorBoundary>
  );
}
