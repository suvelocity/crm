import React from "react";
import { Switch, Route } from "react-router-dom";
import StudentHome from "../components/StudentHome";

export function StudentRoutes() {
  return (
    <Switch>
      <Route path='/' component={StudentHome} />
    </Switch>
  );
}
