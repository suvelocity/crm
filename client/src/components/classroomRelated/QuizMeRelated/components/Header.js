import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    margin: '5vh 0'
  }
});

export default function Header({ text }) {
  const classes = useStyles();
  return (
    <>
      <Container className={classes.container}>
        <Typography variant="h2" color="primary">
          {text} 
        </Typography>
      </Container>
    </>
  );
}
