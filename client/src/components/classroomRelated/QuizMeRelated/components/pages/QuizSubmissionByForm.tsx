import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AccessAlarmIcon from "@material-ui/icons/AccessAlarm";
import network from "../../../../../helpers/network";
import {
  QuizSubmission,
  // AnsweredFiled,
} from "../../../../../typescript/interfaces";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "1em 0",
  },
  list: {
    width: "100%",
    maxWidth: 550,
    backgroundColor: theme.palette.background.paper,
    padding: "0 0.75em",
    borderRadius: "5px",
  },
  li: {
    margin: "0.75em 0",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.main,
    fontWeight: 500,
    borderRadius: "3px",
  },
  field: {
    cursor: "pointer",
    margin: "0.75em 0",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.main,
    padding: "0.5em",
    fontSize: "1.5em",
    fontWeight: 500,
  },
  title: {
    fontSize: "2em",
    fontWeight: 600,
  },
  text: {},
}));

interface IProps {
  id: number;
}

export default function QuizSubmissionByForm(props: IProps) {
  const id = props.id;
  const classes = useStyles();

  const [quizSubmission, setQuizSubmission] = useState<QuizSubmission[]>();

  useEffect(() => {
    const fetchQuizzesSubmissons = async () => {
      try {
        const quizSubmissions: QuizSubmission[] = (
          await network.get(`/api/v1/fieldsubmission/byform/${id}/full`)
        ).data;
        setQuizSubmission(quizSubmissions);
      } catch (e) {
        console.trace(e);
      }
    };
    fetchQuizzesSubmissons();
  }, []);

  return quizSubmission ? (
    <>
      <Container className={classes.container}>
        <Container className={classes.list}>
          <Typography component={"div"} className={classes.title}>
            {"Submited Quizzes"}
          </Typography>
          <List>
            {quizSubmission.map((field: any, index: number) => (
              <ListItem key={index} className={classes.field}>
                <ListItemText
                  primary={field["fields.title"]}
                  secondary={field["SelectedOptions.Option.title"]}
                  disableTypography
                />
              </ListItem>
            ))}
          </List>
        </Container>
      </Container>
    </>
  ) : null;
}
