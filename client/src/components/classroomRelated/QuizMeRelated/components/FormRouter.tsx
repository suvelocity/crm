import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import network from "../../../../helpers/network";
import { makeStyles } from "@material-ui/core/styles";
import { IFormExtended, IAnswer, IOption } from "../../../../typescript/interfaces";
import QuizPage from "./pages/QuizPage"
import FormPage from "./pages/FormPage"

// const Failed = <div>Failed to load page</div>;

const useStyles = makeStyles((theme) => ({
  
}));

export default function FormRouter() {
  const id: number = useParams().id;
  const [form, setForm] = useState<IFormExtended>();
  
  useEffect(() => {
    const fetchForm = async () => {
      const form: IFormExtended = (await network.get(`/api/v1/form/${id}`)).data;
      setForm(form);
    };
    fetchForm();
  },[]);
  if(form) {
    return (form.isQuiz === true) 
    ? <QuizPage form={form}/> 
    : <FormPage form={form}/>
  } else {
    return (
      <div>no form with id {id}</div>
    )
  }
}