import React from "react";
import { Switch, Route } from "react-router-dom";
import NavBar from "../components/NavBar";
import ErrorBoundary from "../helpers/ErrorBoundary";
import AdminCompanyRoutes from "./adminRoutes/AdminCompanyRoutes";
import AdminProcessesRoutes from "./adminRoutes/AdminProcessesRoutes";
import AdminClassesRoutes from "./adminRoutes/AdminClassesRoutes";
import AdminJobsRoutes from "./adminRoutes/AdminJobsRoutes";
import AdminStudentsRoutes from "./adminRoutes/AdminStudentsRoutes";
import AdminMentorRoutes from "./adminRoutes/AdminMentorRoutes";
import AdminTeacherRoutes from "./adminRoutes/AdminTeacherRoutes";

export function AdminRoutes() {
  return (
    <>
      <NavBar />
      <ErrorBoundary>
        <Switch>
          <Route exact path="/">
            <h1 style={{ textAlign: "center" }}>Welcome to CRM</h1>
          </Route>
          <Route path="/company">
            <AdminCompanyRoutes />
          </Route>
          <Route path="/process">
            <AdminProcessesRoutes />
          </Route>
          <Route path="/class">
            <AdminClassesRoutes />
          </Route>
          <Route path="/teacher">
            <AdminTeacherRoutes />
          </Route>
          <Route path="/job">
            <AdminJobsRoutes />
          </Route>
          <Route path="/student">
            <AdminStudentsRoutes />
          </Route>
          <Route path="/mentor">
            <AdminMentorRoutes />
          </Route>
          <Route path="*">
            <div>404 Not Found</div>
          </Route>
        </Switch>
      </ErrorBoundary>
    </>
  );
}
