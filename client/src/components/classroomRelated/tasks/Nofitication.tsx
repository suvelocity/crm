import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Alert, AlertTitle } from "@material-ui/lab";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
  })
);

export default function Nofitication(props: any) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Alert severity='success'>
        <AlertTitle>Nice!</AlertTitle>
        You have completed all of your tasks!
      </Alert>
    </div>
  );
}
