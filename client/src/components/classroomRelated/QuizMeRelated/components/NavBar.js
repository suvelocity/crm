import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
} from "@material-ui/core";

import Menu from "./Menu";

const useStyles = makeStyles({});

export default function NavBar() {
  const classes = useStyles();
  return (
    <>
      <Container>
        <AppBar>
          <Toolbar variant="dense">
            <IconButton edge="start" color="secondary" aria-label="menu">
              <Menu />
            </IconButton>
            <Link to="/" style={{ textDecoration: "none" }}>
              <Typography variant="h6" color="secondary">
                QuizMe
              </Typography>
            </Link>
          </Toolbar>
        </AppBar>
      </Container>
    </>
  );
}
