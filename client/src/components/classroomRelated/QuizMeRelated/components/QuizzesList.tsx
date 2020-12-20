import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

import network from "../../../../helpers/network";
import { IForm } from "../../../../typescript/interfaces";

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
  text: {},
}));

export default function QuizzesList() {
  const classes = useStyles();

  // interface Quiz {
  //   id: number
  //   name: string
  // };
  // type QuizArray = Quiz[];

  interface UserSubmission {
    formId: number;
  }
  // type UserSubmissionsArray = UserSubmissions[];

  const [forms, setForms] = useState<IForm[]>();
  const [userSubmissions, setUserSubmissions] = useState<UserSubmission[]>();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const forms: IForm[] = (await network.get("/api/v1/form/all")).data;
        setForms(forms);
      } catch (e) {
        console.trace(e);
      }
    };
    const fetchUserSubmissions = async () => {
      const userSubmissions: UserSubmission[] = (
        await network.get(`/api/v1/fieldsubmission/1`)
      ).data;
      setUserSubmissions(userSubmissions);
    };
    fetchUserSubmissions();
    fetchQuizzes();
  }, []);

  return forms && userSubmissions ? (
    <>
      <Container className={classes.container}>
        <Container className={classes.list}>
          <List>
            {forms.map((form, index: number) => (
              <Link
                to={`/quizme/form/${form.id}`}
                style={{ textDecoration: "none" }}
                key={index}
              >
                <ListItem className={classes.li}>
                  <ListItemText
                    primary={form.name}
                    className={classes.text}
                    disableTypography
                  ></ListItemText>
                  <ListItemIcon>
                    {
                      //@ts-ignore
                      userSubmissions.some((sub) => sub.formId === form.id) ? (
                        // <Link to={`/quizme/fieldsubmission/byform/${form.id}/full`}>
                         //@ts-ignore
                        <CheckCircleOutline edge="end"/>
                       
                      ) : (
                        //@ts-ignore
                        <RadioButtonUncheckedIcon edge="end" />
                      )
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
