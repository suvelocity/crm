import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import network from "../../../../helpers/network";
import { makeStyles } from "@material-ui/core/styles";
import { IFormExtended, IAnswer, IOption, IFormWithSubs } from "../../../../typescript/interfaces";
import QuizPage from "./pages/QuizPage"
import FormPage from "./pages/FormPage"


const useStyles = makeStyles((theme) => ({
  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '5em',
    fontWeight: 600,
    fontSize: '1.25em',
  }
}));

export default function FormRouter() {
  const classes = useStyles();
  const id: number = Number(useParams<{id:string}>().id);
  const [form, setForm] = useState<IFormWithSubs>();
  const [title, setTitle] = useState<string>();
  console.log("form: ", form)
  useEffect(() => {
    const fetchForm = async () => {
      try{
        const form = (await network.get(`/api/v1/form/${id}`)).data;
        (!form) 
        ? setTitle("This form is either not available or doesn't exist")
        : setForm(form);
      }
      catch(err) {
        setTitle("This form is either not available or doesn't exist");
      }
    };
    fetchForm();
  },[]);
  if(title) {return  <div className={classes.flexCenter}>{title}</div>}
  if(form) {
    return (form.isQuiz === true) 
    ? <QuizPage form={form}/> 
    : <FormPage form={form}/>
  } else {
    console.log(form)
    return (
      <div></div>
    )
  }
}