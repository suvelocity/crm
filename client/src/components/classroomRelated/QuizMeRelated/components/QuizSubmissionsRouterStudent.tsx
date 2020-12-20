import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import QuizSubmissionByStudent from "./pages/QuizSubmissionByStudent"




export default function QuizSubmissionsRouterStudent(value : string) {
  const id: number = useParams().id;
  return <QuizSubmissionByStudent id={id}/>
  

}
