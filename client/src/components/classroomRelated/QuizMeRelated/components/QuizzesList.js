import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { CheckCircleOutline } from "@material-ui/icons/";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

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
    borderRadius: '3px'
  },
  text: {
  },
}));

export default function QuizzesList() {
  const classes = useStyles();

  const [quizzes, setQuizzes] = useState();
  const [userSubmissions, setUserSubmissions] = useState();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const quizzes = (await axios.get("/quizzes/all")).data;
      setQuizzes(quizzes);
    };
    const fetchUserSubmissions = async () => {
      const userSubmissions = (await axios.get(`/users/1/submissions`)).data;
      setUserSubmissions(userSubmissions);
    };
    fetchUserSubmissions();
    fetchQuizzes();
  }, []);

  return (quizzes && userSubmissions) ? (
    <>
      <Container className={classes.container}>
        <Container className={classes.list}>
          <List>
            {quizzes.map((quiz, index) => (
              <Link to={`/quiz/${quiz.id}`} style={{textDecoration: "none"}} key={index}>
                <ListItem className={classes.li}>
                  <ListItemText
                    primary={quiz.name}
                    className={classes.text}
                    disableTypography
                  ></ListItemText>
                  <ListItemIcon>
                    {(userSubmissions.submissions.some(sub => sub.quizId === quiz.id))
                    ? <CheckCircleOutline edge="end" />
                    : <RadioButtonUncheckedIcon edge="end" />
                    }
                  </ListItemIcon>
                </ListItem>
              </Link>
            ))}
          </List>
        </Container>
      </Container>
    </>
  ) : null;
}
