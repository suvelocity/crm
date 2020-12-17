import React, { useEffect, useContext } from "react";
import { Switch, Route } from "react-router-dom";
import "react-loading-wrapper/dist/index.css";
import ErrorBoundary from "../helpers/ErrorBoundary";
import Dashboard from "../components/classroomRelated/dashboard/Dashboard";
import Lessons from "../components/classroomRelated/lessons/Lessons";
import Schedhule from "../components/classroomRelated/schedhule/Schedhule";
import TaskBoard from "../components/classroomRelated/tasks/TaskBoard";
import Teacher from "../components/classroomRelated/teacher/Teacher";
import ClassRoomNavBar from "../components/ClassRoomNavBar";
import network from "../helpers/network";
import { challengeMeChallenges } from "../atoms";
import { AuthContext } from "../helpers";
import { useRecoilState } from "recoil";
import { teacherStudents, classesOfTeacher } from "../atoms";

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
      const allStudents = teacherStudents.map(
        (classRoom: any) => classRoom.Class.Students
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
          <Route path='*'>
            <div>404 Not Found</div>
          </Route>
        </Switch>
      </div>
      {/* </div> */}
    </ErrorBoundary>
  );
}
