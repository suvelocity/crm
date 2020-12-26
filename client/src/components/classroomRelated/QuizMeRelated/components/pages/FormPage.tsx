import React, { useState, useContext } from "react";
import {AuthContext} from '../../../../../helpers'
// import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container, Button
} from "@material-ui/core";
import network from "../../../../../helpers/network";
import { IFormExtended, IFieldSubmission,IField ,IOption } from "../../../../../typescript/interfaces";
import TextualField from '../Textual'
import MultipleChoiceField from '../MultipleChoice'
import Swal from 'sweetalert2'
interface IProps {
  form: IFormExtended;
}
interface IAnswers {
  [key:number]:'string'|IOption[]|undefined
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
  // const { register, handleSubmit, watch, errors } = useForm();

  function swallError (error:Error){
    Swal.fire({  
      icon: 'error',
      title: 'Something went wrong!',
      text: error.message,
      confirmButtonText:'try again',
    })
  }
  function swallSuccess (){
    Swal.fire({  
      icon: 'success',
      title: 'form successfully submitted',
      confirmButtonText:'close',
      timer:2000
    })
  }
  const handleChange = (value:any,fieldId:number) => { 
    const newValue:IAnswers = {...answers}
    newValue[fieldId] = value 
    setAnswers(newValue)
  };
  console.log(answers)
  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault()
    if(!allAnswered()){
      Swal.fire({
        icon: 'info',
        title: 'You have not fully completed the form',
        text:'Some fields remain unanswered',
        showCloseButton:false,
        timer:2000
      })
      return
    }
    try {
      //@ts-ignore
      const studentId = user.id;
      // console.log(studentId)
      // console.log(submission.formSubmission);
      let fieldSubmission = [];
      for (const field in answers) {
        fieldSubmission.push({
          studentId,
          fieldId: Number(field),
          answer: answers[field]
        });
      };
      await network.post(`/api/v1/fieldsubmission/form`, fieldSubmission);
      swallSuccess()
      setFinishTitle(`Well done, form  "${name}" submitted successfully!`);
    }
    catch(error) {
      swallError(error)
      // setFinishTitle(error.message);
      console.log(error);
    }
  };
  function reset(){
    Swal.fire({
      icon:'warning',
      title: 'Are you sure you want to clear the changes?',
      showDenyButton: true,
      showConfirmButton: false,
      showCancelButton: true,
      denyButtonText: `Clear`,
    })
    .then((result) => {
      if (result.isDenied) {
        setAnswers(emptyAnswers)
      }
    })
  }

  const fieldTypes:{[key:number]:string}= {
    1:'select',
    2:'open',
    3:'checkbox'
  }
  return !finishTitle 
  ? <Container className={classes.formWrapper}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <h1 className={classes.title}>{name}</h1>
          {Fields.map<JSX.Element|undefined>((field, index) => {
            const {id,title,typeId} = field
            switch(typeId){
              case 1:
                //@ts-ignore
                return <TextualField key={`field ${id}`} field={field} change={handleChange} value={answers[id]}/>
              case 3:
                //@ts-ignore
                return <MultipleChoiceField key={`field ${id}`} field={field} change={handleChange} value={answers[id]}/>
            }
          }
            // <div key={index}>
            //     {/* LABEL */}
            //     {/* <div> */}
            //       <label htmlFor={id.toString()}>{title}</label>
            //       <input
            //         // ref={register({ required: true })}
            //         name={id.toString()}
            //         required
            //         onChange={(e)=>{
            //           const {value} = e.target
            //           handleChange(value,id)
            //         }}
            //         // @ts-ignore
            //         value={answers[id]}
            //         placeholder="Your answer"
            //       />
            //     {/* </div> */}

            //     {/* INPUT */}
            //     {/* <div> */}
            //       {/* {errors[field.title] && (
            //         <span>This field is required</span>
            //       )} */}
            //     {/* </div> */}
            // </div>
          )}
          <div>
            <Button className={classes.submit} 
            variant="outlined"
            type="submit" 
            
            >
              Submit Form
            </Button>
            <Button 
            className={classes.reset} 
            variant="outlined" color="secondary" 
            onClick={reset}
            type="reset"
            >
              reset
            </Button>
          </div>
      </form>
    </Container>
  : (
  <div>
    {finishTitle}
    <button onClick={()=>{setFinishTitle(undefined)}}>
      go again
    </button>
  </div>
  )
}