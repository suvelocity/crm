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
const useStyles = makeStyles((theme) => ({
  formWrapper: {
    display: "flex",
    justifyContent: "center",
  },
  form: {
    width: "65vw",
    maxWidth: "65vw",
    backgroundColor: theme.palette.background.paper,
    padding: "1em 1.5em",
  },
  field: {
    margin: "1em 0",
    backgroundColor: "#7cc6e6",
    maxWidth: "100%",
  },
  input: {},
}));

interface IProps {
  form: IFormExtended;
}

export default function FormPage(props: IProps) {
  const form = props.form;
  const classes = useStyles();
  const [finishTitle, setFinishTitle] = useState<string>();
  const { register, handleSubmit, watch, errors } = useForm();
  const onSubmit = async (formSubmission: any) => {
    // setFormSubmitted(true);
    try {
      const studentId = 1;
      let fieldSubsArr = [];
      for (const sub in formSubmission) {
        fieldSubsArr.push({
          studentId,
          fieldId: Number(sub),
          textualAnswer: formSubmission[sub],
        });
      }
      await network.post(`/api/v1/fieldsubmission/form`, fieldSubsArr);
      setFinishTitle("Well done, from submitted successfully");
    } catch (error) {
      setFinishTitle(error.message);
    }
  };

  return !finishTitle ? (
    <Container className={classes.formWrapper}>
      <Container className={classes.form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {form.Fields.map((field, index) => (
            <div key={index}>
              {/* LABEL */}
              <div>
                <label htmlFor={field.id.toString()}>{field.title}</label>
              </div>

              {/* INPUT */}
              <div>
                <input
                  ref={register({ required: true })}
                  name={field.id.toString()}
                  placeholder="Your answer"
                />
                {errors[field.title] && <span>This field is required</span>}
              </div>
            </div>
          ))}
          <div>
            <input type="submit" />
          </div>
        </form>
      </Container>
    </Container>
  ) : (
    <div>{finishTitle}</div>
  );
}
