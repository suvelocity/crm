import React, { useEffect, useContext } from "react";
import { Switch, Route } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { useRecoilState } from "recoil";

import "react-loading-wrapper/dist/index.css";
import { AuthContext } from "../helpers";
import network from "../helpers/network";
import ErrorBoundary from "../helpers/ErrorBoundary";
import { IStudent } from "../typescript/interfaces";
import ClassRoomNavBar from "../components/ClassRoomNavBar";
import TeacherContainer from "../components/classroomRelated/teacher/TeacherContainer";
import TeacherDashboard from "../components/classroomRelated/dashboard/TeacherDashBoard";
import Lessons from "../components/classroomRelated/lessons/Lessons";
import Schedhule from "../components/classroomRelated/schedhule/Schedhule";
import TaskBoard from "../components/classroomRelated/tasks/TaskBoard";
import QuizSubmissionsRouter from "../components/classroomRelated/QuizMeRelated/components/QuizSubmissionsRouter";
import Home from "../components/classroomRelated/QuizMeRelated/components/pages/Home";
import FormCreator from "../components/classroomRelated/QuizMeRelated/components/pages/FormCreation/FormCreator";
import { challengeMeChallenges } from "../atoms";
import { teacherStudents, classesOfTeacher } from "../atoms";


const GlobalStyle = createGlobalStyle`
body{
  background-color: ${({ theme }: { theme: any }) => theme.colors.background};
  color: ${({ theme }: { theme: any }) => theme.colors.font};
  .swal2-container {
    z-index:100000000000000
  }
}
`;
export default function TeacherRoutes() {
  const [CMChallenges, setCMChallenges] = useRecoilState(challengeMeChallenges);
  //@ts-ignore
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useRecoilState(teacherStudents);
  const [classesToTeacher, setClassesToTeacher] = useRecoilState(
    classesOfTeacher
  );

  const fetchTeacherData = async () => {
    try {
      const { data: teacherStudents } = await network.get(
        `/api/v1/student/byTeacher/${user.id}`
      );
      setClassesToTeacher(teacherStudents);
      const allStudents = teacherStudents.map((classRoom: any) =>
        classRoom.Class.Students.map((student: IStudent) => ({
          ...student,
          className: classRoom.Class.name,
        }))
      );

      setStudents(allStudents.flat()); //TODO check with multipal classes
    } catch {}
  };

  useEffect(() => {
    (async () => {
      await fetchTeacherData();
    })();
  }, []);

  return (
    <>
      <GlobalStyle />
      <ClassRoomNavBar />
      {/* <ErrorBoundary> */}
      {/* <div id='classroom-container' style={{display:"flex"}} > */}
      <div id="interface-container" style={{ flexGrow: 1 }}>
        <Switch>
          <Route exact path="/">
            <TeacherDashboard />
          </Route>
          <Route path="/lessons">
            <Lessons />
          </Route>
          <Route path="/schedhule">
            <Schedhule />
          </Route>
          <Route path="/tasks">
            <TeacherContainer />
          </Route>
          <Route
            exact
            path="/quizme/fieldsubmission/byform/:id"
            component={QuizSubmissionsRouter}
          />
          {user.userType === "teacher" && (
              <Route exact path="/quizme/create" component={FormCreator} />
            )}
          <Route exact path="/quizme" component={Home} />
          <Route path="*">
            <div>404 Not Found</div>
          </Route>
        </Switch>
      </div>
      {/* </ErrorBoundary> */}
    </>
  );
}
