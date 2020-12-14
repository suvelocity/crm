import React from "react";
import SingleProcess from "../../components/processRelated/SingleProcess";
import AllProcesses from "../../components/processRelated/AllProcesses";
import { Switch, Route } from "react-router-dom";

function AdminProcessesRoutes() {
  return (
    <Switch>
      <Route exact path="/process/all">
        <AllProcesses />
      </Route>
      <Route exact path="/process/:studentId/:jobId">
        <SingleProcess />
      </Route>
    </Switch>
  );
}

export default AdminProcessesRoutes;
