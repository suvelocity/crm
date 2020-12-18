import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { Container, List, ListItem, ListItemText, Typography, Chip } from "@material-ui/core";
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import { IFormExtended, IAnswer, IOption } from "../../../../../typescript/interfaces";

const useStyles = makeStyles((theme) => ({
  quizWrapper: {
    display: 'flex',
    justifyContent: 'center'
  },
  quiz: {
    width: '65vw',
    maxWidth: '65vw',
    backgroundColor: theme.palette.background.paper,
    padding: '1em 1.5em',
  },
  questionTitle: {
    fontSize: '2em',
    fontWeight: 600
  },
  timeRemaining: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '0.5em'
  },
  clockIcon: {
    margin: '0 0.25em'
  },
  field: {
    cursor: "pointer",
    margin: "0.75em 0",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.main,  
    padding: "0.5em",
    fontSize: '1.5em',
    fontWeight: 500
  },
  chipContainer: {
    display: 'flex',
    justifyContent: 'center'
  }
}));

interface IProps {
  id: number
}

export default function FormPage(props: IProps) {
  const id = props.id;
  const classes = useStyles();

  return <div>Form Page</div>
}
