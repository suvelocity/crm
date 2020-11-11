import React from "react";
import AddStudent from "./components/AddStudent";
import AllStudents from "./components/AllStudents";
import SingleStudent from "./components/SingleStudent";
import AddJob from "./components/jobRelated/AddJob";
import SingleJob from "./components/jobRelated/SingleJob";
import AllJobs from "./components/jobRelated/AllJobs";
import NavBar from "./components/NavBar";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Switch>
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
          <Route path="*">
            <div>404 Not Found</div>
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
