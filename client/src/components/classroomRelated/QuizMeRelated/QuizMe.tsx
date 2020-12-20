import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import "./QuizMe.css";
import Home from "./components/pages/Home";
import FormRouter from "./components/FormRouter";
import FormCreator from "./components/pages/FormCreator";
import NavBar from "./components/NavBar";
import QuizSubmissionsRouter from "./components/QuizSubmissionsRouter";

const useStyles = makeStyles({
  container: {
    marginTop: "5em",
  }
});

function QuizMe() {
  const classes = useStyles();
  return (
    <>
      <Container 
      //@ts-ignore
      className={classes.container}>
        <Router>
        <NavBar />
          <Switch>
            <Route exact path="/quizme/form/:id" component={FormRouter}/>
            <Route path="/quizme/fieldsubmission/byform/:id" component={QuizSubmissionsRouter} />
            {/* <Route path="/quizme/api/v1/fieldsubmission/byForm/:id/full" component={QuizSubmissionsRouter()} /> */}
            <Route exact path="/quizme/create" component={FormCreator}/>
            {/* <Route exact path="/quizme/form/:id" component={FormPage} /> */}
            {/* <Route exact path="/statistics" component={UserStats} /> */}
            <Route path="/quizme/" component={Home} />
          </Switch>
        </Router>
      </Container>
    </>
  );
}

export default QuizMe;
