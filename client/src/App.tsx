import React from "react";
import "./App.css";
import AddStudent from "./components/studentRelated/AddStudent";
import AllStudents from "./components/studentRelated/AllStudents";
import SingleStudent from "./components/studentRelated/SingleStudent";
import AddJob from "./components/jobRelated/AddJob";
import AddClass from "./components/classRelated/AddClass";
import SingleJob from "./components/jobRelated/SingleJob";
import AllJobs from "./components/jobRelated/AllJobs";
import NavBar from "./components/NavBar";
import AllClasses from "./components/classRelated/AllClasses";
import SingleClass from "./components/classRelated/SingleClass";
import SingleProcess from "./components/processRelated/SingleProcess";
import MentorClasses from "./components/mentorRelated/MentorClasses";
import ClassDashboard from "./components/mentorRelated/ClassDashboard";
import NewProject from "./components/mentorRelated/NewProject";
import NewClassMentorProject from "./components/mentorRelated/NewClassMentorProject";
import SingleMentor from "./components/mentorRelated/SingleMentor";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ErrorBoundary from "./helpers/ErrorBoundary";
import AllMentors from "./components/mentorRelated/AllMentors";

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <ErrorBoundary>
          <Switch>
            <Route exact path="/">
              <h1 style={{ textAlign: "center" }}>Welcome to CRM</h1>
            </Route>
            <Route exact path="/process/:studentId/:jobId">
              <SingleProcess />
            </Route>
            <Route exact path="/class/add">
              <AddClass />
            </Route>
            <Route exact path="/class/all">
              <AllClasses />
            </Route>
            <Route exact path="/class/:id">
              <SingleClass />
            </Route>
            <Route exact path="/job/all">
              <AllJobs />
            </Route>
            <Route exact path="/job/add">
              <AddJob />
            </Route>
            <Route exact path="/job/:id">
              <SingleJob />
            </Route>
            <Route exact path="/student/add">
              <AddStudent />
            </Route>
            <Route exact path="/student/all">
              <AllStudents />
            </Route>
            <Route exact path="/student/:id">
              <SingleStudent />
            </Route>
            <Route exact path="/mentor">
              <MentorClasses />
            </Route>
            <Route exact path="/mentor/all">
              <AllMentors />
            </Route>
            <Route exact path="/mentor/new">
              <NewProject />
            </Route>
            <Route exact path="/mentor/:id">
              <SingleMentor />
            </Route>
            <Route exact path="/mentor/new/:id">
              <NewClassMentorProject />
            </Route>
            <Route exact path="/mentor/class/:id">
              <ClassDashboard />
            </Route>
            <Route path="*">
              <div>404 Not Found</div>
            </Route>
          </Switch>
        </ErrorBoundary>
      </Router>
    </>
  );
}

export default App;
