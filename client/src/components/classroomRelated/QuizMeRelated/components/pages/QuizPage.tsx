import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
} from "@material-ui/core";
import AccessAlarmIcon from "@material-ui/icons/AccessAlarm";
import network from "../../../../../helpers/network";
import {
  IOption,
  IAnswer,
  IFormExtended,
} from "../../../../../typescript/interfaces";

const useStyles = makeStyles((theme) => ({
  quizWrapper: {
    display: "flex",
    justifyContent: "center",
  },
  quiz: {
    width: "65vw",
    maxWidth: "65vw",
    backgroundColor: theme.palette.background.paper,
    padding: "1em 1.5em",
  },
  questionTitle: {
    fontSize: "2em",
    fontWeight: 600,
  },
  timeRemaining: {
    display: "flex",
    alignItems: "center",
    marginTop: "0.5em",
  },
  clockIcon: {
    margin: "0 0.25em",
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
  chipContainer: {
    display: "flex",
    justifyContent: "center",
  },
}));
interface IProps {
  form: IFormExtended;
}

export default function QuizPage(props: IProps) {
  const form = props.form;
  // const { id } = useParams();
  const classes = useStyles();

  const [quiz, setQuiz] = useState<IFormExtended>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [quizIsOver, setQuizIsOver] = useState<boolean>(false);
  const [finishTitle, setFinishTitle] = useState<string>("Loading...");
  /// TIME REMAINING
  const [minutes, setMinutes] = useState<number>(1);
  const [seconds, setSeconds] = useState<number>(30);

  useEffect(() => {
    const fetchQuiz = async () => {
      const quiz = (await network.get(`/api/v1/form/${form.id}`)).data;

      setQuiz(quiz);
    };
    fetchQuiz();
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (seconds > 0) {
        // console.log(seconds);
        setSeconds((seconds) => seconds - 1);
      } else if (seconds === 0) {
        if (minutes > 0) {
          setMinutes((minutes) => minutes - 1);
          setSeconds(59);
        } else if (minutes === 0) {
          clearInterval(countdown);
          onAnswerSelect(-1, countdown);
        }
      }
    }, 1000);
    return () => {
      clearInterval(countdown);
    };
  }, [seconds, minutes]);

  const findSelectedAnswerIdByTitle = (title: any): number => {
    const currentOptionsArray: IOption[] = quiz!.Fields[currentQuestionIndex]
      .Options;
    const selectedAnswer: any = currentOptionsArray.find(
      (option) => option.title === title
    );
    const id = selectedAnswer ? selectedAnswer.id : -1;
    return id;
  };
  const onAnswerSelect = (selectedAnswerId: number, interval?: any): void => {
    if (!quizIsOver) {
      const newAnswer = {
        //@ts-ignore
        fieldId: quiz.Fields[currentQuestionIndex].id,
        optionId: selectedAnswerId,
      };
      //@ts-ignore
      setAnswers([...answers, newAnswer]);
      //@ts-ignore
      if (quiz.Fields.length - 1 > currentQuestionIndex) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setMinutes(1);
        setSeconds(30);
      } else {
        if (interval) {
          clearInterval(interval);
        }
        submitQuiz(newAnswer);
      }
    }
  };
  const submitQuiz = async (newAnswer: IAnswer) => {
    try {
      setQuizIsOver(true);
      const answersArray = [...answers, newAnswer];
      const studentId = 1;
      const sub = {
        studentId,
        answersArray,
      };
      console.log(sub);
      await network.post("/api/v1/fieldsubmission/quiz", sub);

      setFinishTitle("Well done, quiz submitted successfully");
    } catch (error) {
      const errorMessage = error.response.data.message;
      setFinishTitle(errorMessage);
    }
  };
  if (quiz) {
    if (!quizIsOver) {
      return (
        <>
          <Container className={classes.quizWrapper}>
            <Container className={classes.quiz}>
              <div>
                <Typography component={"div"} className={classes.questionTitle}>
                  {quiz.Fields[currentQuestionIndex].title}
                </Typography>
                <Typography
                  component={"h6"}
                  variant={"h6"}
                  className={classes.timeRemaining}>
                  Time Remaining: {minutes}:
                  {seconds < 10 ? "0" + seconds : seconds}
                  <AccessAlarmIcon className={classes.clockIcon} />
                </Typography>
              </div>
              <List>
                {quiz.Fields[currentQuestionIndex].Options.map(
                  (option: IOption, index: number) => (
                    <ListItem
                      button
                      disableGutters
                      key={index}
                      onClick={(e) => {
                        onAnswerSelect(
                          //@ts-ignore
                          findSelectedAnswerIdByTitle(e.target.innerText)
                        );
                      }}
                      className={classes.field}>
                      <ListItemText
                        primary={`${option.title}`}
                        disableTypography
                      />
                    </ListItem>
                  )
                )}
                <Container className={classes.chipContainer}>
                  <Chip
                    label={`${currentQuestionIndex + 1}/${quiz.Fields.length}`}
                    size={"small"}
                    variant={"outlined"}
                    color={"primary"}
                  />
                </Container>
              </List>
            </Container>
          </Container>
        </>
      );
    } else {
      return <div>{finishTitle}</div>;
    }
  } else {
    return null;
  }
}
