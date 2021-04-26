import React, { useEffect, useContext } from "react";
import { Switch, Route } from "react-router-dom";
import "react-loading-wrapper/dist/index.css";
import ErrorBoundary from "../helpers/ErrorBoundary";
import TeacherDashboard from "../components/classroomRelated/dashboard/TeacherDashBoard";
import Lessons from "../components/classroomRelated/lessons/Lessons";
import TaskBoard from "../components/classroomRelated/tasks/TaskBoard";
import TeacherContainer from "../components/classroomRelated/teacher/TeacherContainer";
import ClassRoomNavBar from "../components/ClassRoomNavBar";
import QuizMe from "../components/classroomRelated/QuizMeRelated/QuizMe";
import QuizPage from "../components/classroomRelated/QuizMeRelated/components/pages/QuizPage";
import styled, { createGlobalStyle } from "styled-components";
import network from "../helpers/network";
import { challengeMeChallenges } from "../atoms";
import { AuthContext } from "../helpers";
import { useRecoilState } from "recoil";
import { teacherStudents, classesOfTeacher } from "../atoms";
import { IStudent } from "../typescript/interfaces";
import AllStudents from "../components/studentRelated/AllStudents";

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
      console.log(teacherStudents);
      setStudents(allStudents.flat());
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
          <Route path="/tasks">
            <TeacherContainer />
          </Route>
          <Route path="/students">
            <AllStudents
              classIds={classesToTeacher.map(
                (classOfTeacher: any) => classOfTeacher.classId
              )}
            />
          </Route>
          <Route exact path="/quizme">
            <QuizMe />
          </Route>
          <Route exact path="/quizme/quiz/:id">
            {/* @ts-ignore */}
            <QuizPage />
          </Route>
          <Route path="*">
            <div>404 Not Found</div>
          </Route>
        </Switch>
      </div>
      {/* </ErrorBoundary> */}
    </>
  );
}
