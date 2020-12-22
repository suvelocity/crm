import React from "react";
import { SignIn } from "../components/auth";
import { Switch, Route } from "react-router-dom";
import ErrorBoundary from '../helpers/ErrorBoundary'
export function PublicRoutes() {
  return (
    <Switch>
      <Route path='/test'>
          <div>
            Error test
        <ErrorBoundary>
            <span>
             {{al:'a'}}
            </span>
        </ErrorBoundary>
          </div>
      </Route>
      <Route path='/' component={SignIn} />
    </Switch>
  );
}
