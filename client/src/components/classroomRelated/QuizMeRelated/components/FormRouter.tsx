import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { Container, List, ListItem, ListItemText, Typography, Chip } from "@material-ui/core";
import { IQuiz, IAnswer, IOption } from "../../../../typescript/interfaces";
import QuizPage from "./pages/QuizPage"
import FormPage from "./pages/FormPage"

const Failed = <div>Failed to load page</div>;
const useStyles = makeStyles((theme) => ({
  
}));

export default function FormRouter() {
  const id: number = useParams().id;
  
  const [form, setForm] = useState<IQuiz>();
  useEffect(() => {
    const fetchForm = async () => {
      const form: IQuiz = (await axios.get(`/api/v1/quiz/${id}`)).data;
      setForm(form);
    };
    fetchForm();
  },[]);
  if(form) {
    return ("form.isQuiz") ? <QuizPage id={form.id}/> : <FormPage id={form.id}/>
  } else {
    return (
      <div></div>
    )
  }
}