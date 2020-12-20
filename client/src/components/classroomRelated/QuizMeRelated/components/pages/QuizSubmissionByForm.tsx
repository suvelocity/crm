import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AccessAlarmIcon from "@material-ui/icons/AccessAlarm";
import network from "../../../../../helpers/network";
import { QuizSubmission, AnsweredFiled } from "../../../../../typescript/interfaces";
import {
    Container,
    List,
    ListItem,
    ListItemText,
    Typography,
  } from "@material-ui/core";
  
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';



  function createData(name : string, calories: number, fat : number, carbs : number, protein : number) {
    return { name, calories, fat, carbs, protein };
  }
  
  const useStyles = makeStyles((theme) => ({
    container: {
      padding: "1em 0",
    },
    table: {
        minWidth: 650,
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
    id: number
  }

export default function QuizSubmissionByForm(props: IProps) {
    const id = props.id;
    const classes = useStyles();
    const [quizSubmission, setQuizSubmission] = useState<QuizSubmission[]>();
    const [rows, setRows] =useState<any[]>([{
        "formId" : "first",
        "Student.firstName":  "first",
        "Student.lastName":"first",
        "fields.title":"first",
        "SelectedOptions.Option.title":"first",
    }]);

    useEffect(() => {
        const fetchQuizzesSubmissons = async () => {
          try {
            const quizSubmissions: QuizSubmission[] = (await network.get(`/api/v1/fieldsubmission/byform/${id}/full`)).data;
            setQuizSubmission(quizSubmissions);
            if (quizSubmissions){
                //@ts-ignore
                quizSubmission.map(
                    (filed: any, index: number) =>{
                        setRows(currentRows =>[
                            {
                                "formId" : filed["formId"],
                                "Student.firstName":  filed["Student.firstName"],
                                "Student.lastName":filed["Student.lastName"],
                                "fields.title":filed["fields.title"],
                                "SelectedOptions.Option.title":filed["SelectedOptions.Option.title"],
                            },
                            //@ts-ignore 
                            ...currentRows
                        ])
                    }
                )
            }
           
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
                {quizSubmission.map(
                    (field: any , index:number) =>(
                        <ListItem 
                        key={index}
                        className={classes.field}
                        >
                            <ListItemText
                            primary={field["fields.title"]}
                            secondary={field["SelectedOptions.Option.title"]}
                            disableTypography
                            /> 
                            
                        </ListItem>
                        ),
                        //@ts-ignore
                        console.log(quizSubmission)
                    
                )}
            </List>

            <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Form Id</TableCell>
            <TableCell align="right">First Name</TableCell>
            <TableCell align="right">Last Name</TableCell>
            <TableCell align="right">Question</TableCell>
            <TableCell align="right">Answer</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {row.formId}
              </TableCell>
              <TableCell align="right">{row["Student.firstName"]}</TableCell>
              <TableCell align="right">{row["Student.lastName"]}</TableCell>
              <TableCell align="right">{row["fields.title"]}</TableCell>
              <TableCell align="right">{row["SelectedOptions.Option.title"]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
            </Container>
          </Container>
        </>
      ) : null;
    }
