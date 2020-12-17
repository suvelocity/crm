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
  const { myTasks } = props;
  const classes = useStyles();
  console.log(myTasks);
  const unfinishedTasks =
    myTasks?.filter((task: any) => {
      if (task.status !== "done") {
        return true;
      }
      return false;
    }) || [];

  console.log(unfinishedTasks);

  return (
    <div className={classes.root}>
      {unfinishedTasks.length === 0 ? (
        <Alert severity='success'>
          <AlertTitle>Nice!</AlertTitle>
          You have completed all of your tasks!
        </Alert>
      ) : (
        <Alert severity='warning'>
          <AlertTitle>Please Notice</AlertTitle>
          {`you have ${unfinishedTasks.length} tasks to complete! `}
          <br />
          <strong>get to work!</strong>
        </Alert>
      )}
    </div>
  );
}
