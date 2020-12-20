import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import QuizSubmissionByStudent from "./pages/QuizSubmissionByStudent"
import QuizSubmissionByForm from "./pages/QuizSubmissionByForm"



export default function QuizSubmissionsRouterForm() {
  const id: number = useParams().id;
  return <QuizSubmissionByForm id={id}/>
}
