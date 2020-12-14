import React from "react";
import AllClasses from "../../components/classRelated/AllClasses";
import SingleClass from "../../components/classRelated/SingleClass";
import AddClass from "../../components/classRelated/AddClass";
import { Switch, Route } from "react-router-dom";

function AdminClassesRoutes() {
  return (
    <Switch>
      <Route exact path="/class/add">
        <AddClass />
      </Route>
      <Route exact path="/class/all">
        <AllClasses />
      </Route>
      <Route exact path="/class/:id">
        <SingleClass />
      </Route>
    </Switch>
  );
}

export default AdminClassesRoutes;
