import React, { useEffect, useContext } from "react";
import { Switch, Route } from "react-router-dom";
import "react-loading-wrapper/dist/index.css";
import ErrorBoundary from "../helpers/ErrorBoundary";
import Dashboard from "../components/classroomRelated/dashboard/Dashboard";
import Lessons from "../components/classroomRelated/lessons/Lessons";
import Schedhule from "../components/classroomRelated/schedhule/Schedhule";
import TaskBoard from "../components/classroomRelated/tasks/TaskBoard";
import TeacherContainer from "../components/classroomRelated/teacher/TeacherContainer";
import ClassRoomNavBar from "../components/ClassRoomNavBar";
import QuizMe from '../components/classroomRelated/QuizMeRelated/QuizMe'
import QuizPage from '../components/classroomRelated/QuizMeRelated/components/QuizPage'

import network from "../helpers/network";
import { challengeMeChallenges } from "../atoms";
import { AuthContext } from "../helpers";
import { useRecoilState } from "recoil";
import { teacherStudents, classesOfTeacher } from "../atoms";
import { IStudent } from "../typescript/interfaces";

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

      setStudents(allStudents.flat()); //TODO check with multipal classes
    } catch {}
  };

  useEffect(() => {
    (async () => {
      await fetchTeacherData();
    })();
  }, []);

  return (
    <ErrorBoundary>
      <ClassRoomNavBar />
      {/* <div id='classroom-container' style={{display:"flex"}} > */}
      <div id='interface-container' style={{ flexGrow: 1 }}>
        <Switch>
          <Route exact path='/'>
            <TeacherContainer />
          </Route>
          <Route path='/lessons'>
            <Lessons />
          </Route>
          {/* <Route path='/schedhule'>
            <Schedhule />
          </Route> */}
          {/* <Route path='/tasks'>
            <TaskBoard />
          </Route> */}
          {/* <Route path='/teacher'>
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
