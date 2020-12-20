import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Header from "./Header";
import QuizzesList from "./QuizzesList";

const useStyles = makeStyles({
  container: {
    marginTop: "5em",
  },
});

export default function Home() {
  const classes = useStyles();
  return QuizzesList ? (
    <>
        <Header text='Welcome to QuizMe!'/>
        <QuizzesList />
    </>
  ) : null
}
