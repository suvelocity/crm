import React, { useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import "./QuizMe.css";
import Home from "./components/pages/Home";
import FormRouter from "./components/FormRouter";
import FormCreator from "./components/pages/FormCreation/FormCreator";
import QuizPage from "./components/pages/QuizPage";
import NavBar from "./components/NavBar";
import QuizSubmissionsRouter from "./components/QuizSubmissionsRouter";
import { AuthContext } from "../../../helpers";

const useStyles = makeStyles({
  container: {
    marginTop: "5em",
  },
});

function QuizMe() {
  //@ts-ignore
  const { user } = useContext(AuthContext);
  const { userType } = user;
  const classes = useStyles();
  return (
    <>
      <Container
      //@ts-ignore
      // className={classes.container}
      >
        <Router>
          {/* <NavBar /> */}
          <Switch>
            <Route path="/quizme/form/:id" component={FormRouter} /> 
            {/* <Route exact path="/quizme/form/:id" >
            <h1>adsa</h1>
            </Route> */}
            <Route
              exact
              path="/quizme/fieldsubmission/byform/:id"
              component={QuizSubmissionsRouter}
            />
            {/* <Route path="/quizme/api/v1/fieldsubmission/byForm/:id/full" component={QuizSubmissionsRouter()} /> */}
            {user.userType === "teacher" && (
              <Route exact path="/quizme/create" component={FormCreator} />
            )}
            {/* <Route exact path="/quizme/form/:id" component={FormPage} /> */}
            {/* <Route exact path="/statistics" component={UserStats} /> */}
            <Route exact path="/quizme" component={Home} />
          </Switch>
        </Router>
      </Container>
    </>
  );
}

export default QuizMe;
