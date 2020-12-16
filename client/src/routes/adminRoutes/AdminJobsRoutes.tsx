import React from "react";
import AddJob from "../../components/jobRelated/AddJob";
import SingleJob from "../../components/jobRelated/SingleJob";
import AllJobs from "../../components/jobRelated/AllJobs";
import { Switch, Route } from "react-router-dom";

function AdminProcessesRoutes() {
  return (
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
    </Switch>
  );
}

export default AdminProcessesRoutes;
