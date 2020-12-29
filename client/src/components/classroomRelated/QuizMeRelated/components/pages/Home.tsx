import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Header from "../Header";
import QuizzesList from "../QuizzesList";
import { AuthContext } from "../../../../../helpers";

const useStyles = makeStyles({
  container: {
    marginTop: "5em",
  },
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
    </>
  ) : null
}
