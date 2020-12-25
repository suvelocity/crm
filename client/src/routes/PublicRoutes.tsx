import React from "react";
import { SignIn } from "../components/auth";
import { Switch, Route } from "react-router-dom";

export function PublicRoutes() {
  return (
    <Switch>
      <Route path='/' component={SignIn} />
    </Switch>
  );
}
