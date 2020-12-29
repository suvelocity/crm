import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import Header from "../Header";
import QuizzesList from "../QuizzesList";
import { AuthContext } from "../../../../../helpers";
import { Container, Button } from "@material-ui/core";

const useStyles = makeStyles({
  container: {
    marginTop: "5em",
  },
  flexCenter: {
    display: 'flex',
    justifyContent: 'center'
  }
});

export default function Home() {
  //@ts-ignore
  const { user } = useContext(AuthContext);
  const { userType } = user;
  const classes = useStyles();
  return QuizzesList ? (
    <>
      <Header text="Welcome to QuizMe!" />
      <QuizzesList />
      {userType === 'teacher' && (
        <Container>
          <Link to={'/quizme/create'}
                style={{textDecoration: 'none'}}
                className={classes.flexCenter}
          >
            <Button variant={'contained'}
                    color={'primary'}
            >
              CREATE A NEW FORM/QUIZ
            </Button>
          </Link>
        </Container>
      )}
    </>
  ) : null
}
