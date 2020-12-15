import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { Container, List, ListItem, ListItemText, Typography, Chip } from "@material-ui/core";
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';

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

export default function QuizPage() {
  const { id } = useParams();
  const classes = useStyles();
  const [quiz, setQuiz] = useState();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizIsOver, setQuizIsOver] = useState(false);
  const [finishTitle, setFinishTitle] = useState("Loading...");
  /// TIME REMAINING
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    const fetchQuiz = async () => {
      const quiz = (await axios.get(`/quizzes/${id}`)).data;
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

  const findSelectedAnswerIdByTitle = (title) => {
    const currentFieldsArray = quiz.Questions[currentQuestionIndex].Fields;
    const selectedAnswer = currentFieldsArray.find(
      (field) => field.title === title
    );
    const id = selectedAnswer ? selectedAnswer.id : -1;
    return id;
  };
  const onAnswerSelect = (selectedAnswerId, interval) => {
    if (!quizIsOver) {
      console.log(selectedAnswerId);
      setAnswers([
        ...answers,
        {
          questionId: quiz.Questions[currentQuestionIndex].id,
          answerId: selectedAnswerId,
        },
      ]);
      if (quiz.Questions.length - 1 > currentQuestionIndex) {
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
      await axios.post("/submissions", {
        userId: 3, // 3
        quizId: quiz.id, // 1
        answersSelected: answers,
      });
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
                <Typography component={'div'} variant={'div'} className={classes.questionTitle}>
                  {quiz.Questions[currentQuestionIndex].title}
                </Typography>
                <Typography component={'h6'} variant={'h6'} className={classes.timeRemaining}>
                  Time Remaining: {minutes}:
                  {seconds < 10 ? "0" + seconds : seconds}
                  <AccessAlarmIcon className={classes.clockIcon}/>
                </Typography>
              </div>
              <List>
                {quiz.Questions[currentQuestionIndex].Fields.map(
                  (field, index) => (
                    <ListItem
                      button
                      disableGutters
                      key={index}
                      onClick={(e) =>
                        onAnswerSelect(
                          findSelectedAnswerIdByTitle(e.target.value)
                      )}
                      className={classes.field}
                    >
                      <ListItemText primary={`${field.title}`} disableTypography/>
                    </ListItem>
                  )
                )}
                <Container className={classes.chipContainer}>
                  <Chip label={`${currentQuestionIndex+1}/${quiz.Questions.length}`}
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
