import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import "./QuizMe.css";
// import Home from "./components/Home";
// import QuizPage from "./components/QuizPage";
// import UserStats from "./components/UserStats";
// import NavBar from "./components/NavBar";

const useStyles = makeStyles({
  container: {
    marginTop: "5em",
  }
});

function QuizMe() {
  // const classes = useStyles();
  return (
    <>
      {/* <Container className={classes.container}>
        <Router>
        <NavBar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/quiz/:id" component={QuizPage} />
            <Route exact path="/statistics" component={UserStats} />
          </Switch>
        </Router>
      </Container> */}
    </>
  );
}

export default QuizMe;
