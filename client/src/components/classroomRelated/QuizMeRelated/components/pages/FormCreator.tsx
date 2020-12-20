import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
} from "@material-ui/core";
import network from "../../../../../helpers/network";
import { IFormExtended, IField } from "../../../../../typescript/interfaces";
const useStyles = makeStyles((theme) => ({}));

export default function FormPage() {
  const classes = useStyles();
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [submissionSuccessful, setSubmissionSuccessful] = useState<boolean>();
  const { register, handleSubmit, watch, errors } = useForm();
  const onSubmit = async (formSubmission: any) => {};

  return (
    <>
      {/* LABEL */}
      <div>
        <label htmlFor={"formName"}>What is the name of your form?</label>
      </div>
      {/* INPUT */}
      <div>
        <input
          ref={register({ required: true })}
          name={"formName"}
          placeholder="Your answer"
        />
        {errors["formName"] && <span>This field is required</span>}
      </div>
      
      {/* LABEL */}
      <div>
        <label htmlFor={"formName"}>What is the name of your form?</label>
      </div>
      {/* INPUT */}
      <div>
        <input
          ref={register({ required: true })}
          name={"formName"}
          placeholder="Your answer"
        />
        {errors["formName"] && <span>This field is required</span>}
      </div>



    </>
  );
}
