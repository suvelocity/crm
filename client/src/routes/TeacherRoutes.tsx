import React, { useEffect } from "react";
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
import { useRecoilState } from "recoil";
import { challengeMeChallenges } from "../atoms";
import Cookies from "js-cookie";

export default function TeacherRoutes() {
  const [CMChallenges, setCMChallenges] = useRecoilState(challengeMeChallenges);

  useEffect(() => {
    (async () => {
      try {
        // const {
        //   data: token,
        // } = await network.post(`http://35.239.15.221:8080/api/v1/auth/token`, {
        //   token: Cookies.get("refreshToken"),
        // });
        // console.log("====================================");
        // console.log(token);
        // console.log("====================================");
        // const {data:chllenges} = await network.get("http://35.239.15.221:8080/api/v1/challenges",hea)
      } catch {}
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
