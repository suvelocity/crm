import React from "react";
import { Switch, Route } from "react-router-dom";
import AddStudent from "../components/studentRelated/AddStudent";
import AllStudents from "../components/studentRelated/AllStudents";
import SingleStudent from "../components/studentRelated/SingleStudent";
import AddJob from "../components/jobRelated/AddJob";
import AddClass from "../components/classRelated/AddClass";
import SingleJob from "../components/jobRelated/SingleJob";
import AllJobs from "../components/jobRelated/AllJobs";
import NavBar from "../components/NavBar";
import AllClasses from "../components/classRelated/AllClasses";
import SingleClass from "../components/classRelated/SingleClass";
import AllCompanies from "../components/companyRelated/AllCompanies";
import SingleCompany from "../components/companyRelated/SingleCompany";
import SingleProcess from "../components/processRelated/SingleProcess";
import AddCompany from "../components/companyRelated/AddCompany";
import ErrorBoundary from "../helpers/ErrorBoundary";
import AllProcesses from "../components/processRelated/AllProcesses";

export function AdminRoutes() {
  return (
    <>
      <NavBar />
      <ErrorBoundary>
        <Switch>
          <Route exact path='/'>
            <h1 style={{ textAlign: "center" }}>Welcome to CRM</h1>
          </Route>
          <Route exact path='/company/add'>
            <AddCompany />
          </Route>
          <Route exact path='/company/all'>
            <AllCompanies />
          </Route>
          <Route exact path='/company/:id'>
            <SingleCompany />
          </Route>
          <Route exact path='/process/all'>
            <AllProcesses />
          </Route>
          <Route exact path='/process/:studentId/:jobId'>
            <SingleProcess />
          </Route>
          <Route exact path='/class/add'>
            <AddClass />
          </Route>
          <Route exact path='/class/all'>
            <AllClasses />
          </Route>
          <Route exact path='/class/:id'>
            <SingleClass />
          </Route>
          <Route exact path='/job/all'>
            <AllJobs />
          </Route>
          <Route exact path='/job/add'>
            <AddJob />
          </Route>
          <Route exact path='/job/:id'>
            <SingleJob />
          </Route>
          <Route exact path='/student/add'>
            <AddStudent />
          </Route>
          <Route exact path='/student/all'>
            <AllStudents />
          </Route>
          <Route exact path='/student/:id'>
            <SingleStudent />
          </Route>
          <Route path='*'>
            <div>404 Not Found</div>
          </Route>
        </Switch>
      </ErrorBoundary>
    </>
  );
}