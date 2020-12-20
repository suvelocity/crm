import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import network from "../../../../helpers/network";
import { makeStyles } from "@material-ui/core/styles";
import { Container, List, ListItem, ListItemText, Typography, Chip } from "@material-ui/core";
import { IFormExtended, IAnswer, IOption } from "../../../../typescript/interfaces";
import QuizSubmissionByStudent from "./pages/QuizSubmissionByStudent"
import QuizSubmissionByForm from "./pages/QuizSubmissionByForm"




const useStyles = makeStyles((theme) => ({
  
}));

export default function QuizSubmissionsRouter(value : string) {
  const id: number = useParams().id;
  return <QuizSubmissionByForm id={id}/>
  
  // return (value === "student") ? <QuizSubmissionByStudent id={id}/> : <QuizSubmissionByForm id={id}/>

}
