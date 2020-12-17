import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { Container, List, ListItem, ListItemText, Typography, Chip } from "@material-ui/core";
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import { IQuiz, IAnswer, IOption } from "../../../../../typescript/interfaces";

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

export default function QuizPage2(props: IProps) {
  const id = props.id;
  const classes = useStyles();

  const [quiz, setQuiz] = useState<IQuiz>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [quizIsOver, setQuizIsOver] = useState<boolean>(false);
  const [finishTitle, setFinishTitle] = useState<string>("Loading...");
  /// TIME REMAINING
  const [minutes, setMinutes] = useState<number>(1);
  const [seconds, setSeconds] = useState<number>(30);

  useEffect(() => {
    const fetchQuiz = async () => {
      const quiz = (await axios.get(`/api/v1/quiz/${id}`)).data || [];
      setQuiz(quiz);
    };
    fetchQuiz();
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      if(seconds > 0) {
        console.log(seconds);
        setSeconds(seconds => seconds-1);
      } else if(seconds === 0) {
        if(minutes > 0) {
          setMinutes(minutes => minutes-1);
          setSeconds(59);
        } else if(minutes === 0){
          clearInterval(countdown);
          onAnswerSelect(-1, countdown);
        }
      };
    },1000);
    return () => {
      clearInterval(countdown);
    }
  }, [seconds, minutes]);

  const findSelectedAnswerIdByTitle = (title : string) :number => {
    const currentFieldsArray : IOption[] = quiz!.Fields[currentQuestionIndex].Options;
    const selectedAnswer: any = currentFieldsArray.find(
      (field) => field.title === title
    );
    const id = selectedAnswer ? selectedAnswer.id : -1;
    return id;
  };
  const onAnswerSelect = (selectedAnswerId : number, interval? : any) :void => {
    if (!quizIsOver) {
      console.log(selectedAnswerId);
      setAnswers([
        ...answers,
        {
          //@ts-ignore
          questionId: quiz.Fields[currentQuestionIndex].id,
          answerId: selectedAnswerId,
        },
      ]);
      //@ts-ignore
      if (quiz.Fields.length - 1 > currentQuestionIndex) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setMinutes(1);
        setSeconds(30);
      } else {
        if (interval) {
          clearInterval(interval);
        }
        submitQuiz();
      }
    }
  };
  const submitQuiz = async () => {
    try {
      setQuizIsOver(true);
      // await axios.post("/submissions", {
      //   userId: 3, // 3
      //   quizId: quiz.id, // 1
      //   answersSelected: answers,
      // });
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
                <Typography component={'div'} //@ts-ignore
                variant={'div'} className={classes.questionTitle}>
                  {quiz.Fields[currentQuestionIndex].title}
                </Typography>
                <Typography component={'h6'} variant={'h6'} className={classes.timeRemaining}>
                  Time Remaining: {minutes}:
                  {seconds < 10 ? "0" + seconds : seconds}
                  <AccessAlarmIcon className={classes.clockIcon}/>
                </Typography>
              </div>
              <List>
                {quiz.Fields[currentQuestionIndex].Options.map(
                  (option : IOption, index: number) => (
                    <ListItem
                      button
                      disableGutters
                      key={index}
                      onClick={(e) =>
                        onAnswerSelect( //@ts-ignore
                          findSelectedAnswerIdByTitle(e.target.value)
                      )}
                      className={classes.field}
                    >
                      <ListItemText primary={`${option.title}`} disableTypography/>
                    </ListItem>
                  )
                )}
                <Container className={classes.chipContainer}>
                  <Chip label={`${currentQuestionIndex+1}/${quiz.Fields.length}`}
                        size={'small'}
                        variant={'outlined'}
                        color={'primary'}
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
