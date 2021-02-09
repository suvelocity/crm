import React from "react";
import AddStudent from "../../components/studentRelated/AddStudent";
import AllStudents from "../../components/studentRelated/AllStudents";
import SingleStudent from "../../components/studentRelated/SingleStudent";
import { Switch, Route } from "react-router-dom";

function AdminProcessesRoutes() {
  return (
    <Switch>
      <Route exact path="/student/add">
        <AddStudent />
      </Route>
      <Route exact path="/student/all">
        <AllStudents />
      </Route>
      <Route exact path="/student/:id">
        <SingleStudent />
      </Route>
    </Switch>
  );
}

export default AdminProcessesRoutes;
