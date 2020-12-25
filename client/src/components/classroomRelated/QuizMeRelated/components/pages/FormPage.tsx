import React, { useState, useEffect, useContext } from "react";
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
import { AuthContext } from "../../../../../helpers";

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

export default function FormPage({form:{Fields,id,name}}: IProps):JSX.Element {
  //UPDATED
  const emptyAnswers:IAnswers = {}
  const [finishTitle, setFinishTitle] = useState<string>();
  const [answers,setAnswers] = useState<IAnswers>(
    Fields.reduce((prev,cur)=>{
      prev[cur.id]=undefined
      return prev 
    },emptyAnswers)
    ) 
    //@ts-ignore
    const {user} = useContext(AuthContext)
    
    function allAnswered (){
      return Object.values(answers).every(value=>{
        return value&&value.length
      })

    } 
    const useStyles = makeStyles((theme) => ({
      formWrapper: {
        display: "flex",
        justifyContent: "center",
      },
      form: {
        boxShadow:'1px 3px 4px 1px  rgba(0,0,0,.2)',
        width: "fit-content",
        maxWidth: "85vw",
        backgroundColor: theme.palette.background.paper,
        padding: "5% 3%",
        borderRadius:'2.5vw',
        position:'relative',
      },
      title:{
        boxShadow:'1.5px 1px 2px 1px  rgba(0,0,0,.2)',
        color:'white',
        background:'rgba(3%,6%,12%,0.9)',
        borderRadius:'1.2vw',
        opacity:.9,
        padding:'.2rem .5rem',
        margin:'0',
        // width:'100%',
        marginTop:'-2%',
        marginLeft:'-1%',
        marginBottom:'1rem'
      },
      field: {
        margin: "1em 0",
        backgroundColor: "#7cc6e6",
        maxWidth: "100%",
      },
    submit: {
      "&:hover":{
        color:'white',
        backgroundColor: allAnswered()
        ? '#24e765'
        : '#db7515'
      },
    },
    reset:{
      position:'absolute',
      right:'1.6em',
    }
  }));
  const classes = useStyles();
  // const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [finishTitle, setFinishTitle] = useState<string>();
  const { register, handleSubmit, watch, errors } = useForm();
  const onSubmit = async (formSubmission: any) => {
    // setFormSubmitted(true);
    try {
      const studentId = user.id;
      // console.log(submission.formSubmission);
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
      console.log(error);
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
