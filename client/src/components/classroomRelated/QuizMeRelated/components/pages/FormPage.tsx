import React, { useState, useContext } from "react";
import {useParams} from 'react-router-dom'
import { withRouter } from "react-router";
import {AuthContext} from '../../../../../helpers'
// import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container, Button
} from "@material-ui/core";
import network from "../../../../../helpers/network";
import { IFormExtended, IFieldSubmission,IField ,IOption,IFieldExtended, IFormWithSubs, IFieldWithSubs } from "../../../../../typescript/interfaces";
import {TextualField, SingleChoiceField,  MultipleChoiceField} from '../fields' 
import Swal from 'sweetalert2'
import { capitalize, formatPhone } from "../../../../../helpers";
interface IProps {
  form: IFormWithSubs;
}
interface IAnswers {
  [key:number]:string|IOption[]|undefined|null
}
const extractAnswers = (Fields:IFieldWithSubs[]) => {
  const emptyAnswers:IAnswers = {}
  return Fields.reduce((prev,{submission:submissions,id,typeId})=>{
    const submission = submissions[0]
    if(submission){
      console.log('ineA',typeId,submission)
      const {textualAnswer,SelectedOptions} = submission
      //@ts-ignore
      prev[id] = typeId === 1
      ? textualAnswer
      : SelectedOptions.map(({optionId,})=>({id:optionId}))
    }else{
      prev[id]=undefined
    }
    console.log('ineB',prev)
    return prev 
  },emptyAnswers)
}

  function FormPage({form:{Fields,id,name,Teacher}}: IProps):JSX.Element {
  //UPDATED
  // console.log(extractAnswers(Fields))
  const emptyAnswers:IAnswers = {}
  const [answers,setAnswers] = useState<IAnswers>(extractAnswers(Fields)) 
  function allAnswered (){      
      return Object.values(answers)
      .every((value,i)=>{
        return value&&value.length
      })
  } 
  const [status, setStatus] = useState<string|undefined>(allAnswered()?'success':undefined);
  console.log(answers)
  //@ts-ignore
  const {user} = useContext(AuthContext)
  const {id:formId} = useParams<{id?:string}>()

  const useStyles = makeStyles((theme) => ({
      formWrapper: {
        display: "flex",
        justifyContent: "center",
        margin:'1em 0 ',
        color: 'black'
      },
      form: {
        boxShadow:'1px 3px 4px 1px  rgba(0,0,0,.2)',
        width: "fit-content",
        maxWidth: "85vw",
        backgroundColor: 'rgba(	63, 81, 181,.15)',
        padding: "3vh 3vh 2vh 3vh",
        borderRadius:'2vw',
        position:'relative',
      },
      title:{
        margin:0,
      },
      teacherName:{
        margin:0,
        fontSize:'medium',
        // background:'rgba(3%,6%,12%,0.9)',
        // borderRadius:'.5em',
        padding:'.2em',
        
      },
      header:{
        borderRadius:'2vw',
        // boxShadow:'1.5px 1px 2px 1px  rgba(0,0,0,.2)',
        color:'white',
        // background:'rgba(3%,6%,12%,0.9)',
        background:'#3f51b5',
        opacity:.9,
        // padding:'.2rem .5rem',
        padding:'1em',
        // width:'100%',
        marginTop:'-2%',
        marginLeft:'-1%',
        marginBottom:'1rem',
      },
      field: {
        margin: ".5em 0",
        padding:'1em',
        borderRadius:'2vw',
        border:'1px solid rgba(0,0,0,.25)',
        backgroundColor: theme.palette.background.paper,
        '& input':{
          // border:'red solid 3px'
        }
        // maxWidth: "100%",
      },
      submit: {
        backgroundColor:'white',
        "&:hover":{
          color:'white',
          backgroundColor: allAnswered()
          ? '#24e765'
          : '#db7515'
        },
      },
      reset:{

        backgroundColor:'white',
        position:'absolute',
        right:'1.6em',
        "&:hover":{
          color:'white',
          backgroundColor: status?'violet':'red'
        },
      }
  }));

  const classes = useStyles();

  function swallError (message:string){
    Swal.fire({  
      icon: 'error',
      title: 'Something went wrong!',
      text: message,
      confirmButtonText:'try again',
    })
  }
  
  function swallSuccess (){
    Swal.fire({  
      icon: 'success',
      title: 'form successfully submitted',
      text:`you can view your answers, 
      or retake the form if you want to`,
      confirmButtonText:'close',
    })
  }

  const handleChange = (value:any,fieldId:number) => { 
    const newValue:IAnswers = {...answers}
    newValue[fieldId] = value 
    setAnswers(newValue)
  };
  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault()
    if(!allAnswered()){
      console.log(answers)
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
      let fieldSubmissions = [];
      for (const field in answers) {
        console.log(field,answers[field])
        fieldSubmissions.push({
          studentId,
          fieldId: Number(field),
          answer: answers[field]
        });
      };
      console.log('subbbed',fieldSubmissions)
      const {data:submission}:{data:string} = await network.post(`/api/v1/fieldsubmission/form`, {id:Number(formId),submissions:fieldSubmissions});
      if( submission === 'success'){
        swallSuccess()
        setStatus(submission);
      }else{
        swallError(submission)
      }
    }
    catch(error) {
      console.log(error.message);
    }
  };
  async function reset(){
    if(!status){
      const result = await Swal.fire({
        icon:'warning',
        title: 'Are you sure you want to clear the changes?',
        showDenyButton: true,
        showConfirmButton: false,
        showCancelButton: true,
        denyButtonText: `Clear`,
      })
      if (!result.isDenied) {
        return //do nothing
      }
    }else{
      setAnswers(emptyAnswers)
      setStatus(undefined)
    }
  }
    
  function getField(typeId:number,field:IFieldExtended,id:number){
    switch(typeId){
      case 1:
        return <SingleChoiceField 
          disabled={status?true:false} 
          className={classes.field} 
          key={`field ${id}`} 
          //@ts-ignore
          field={field} 
          change={handleChange} 
          //@ts-ignore
          value={answers[id]}
        />
      case 2:
        return <TextualField 
          disabled={status?true:false} 
          className={classes.field} 
          key={`field ${id}`} 
          //@ts-ignore
          field={field} 
          change={handleChange} 
          //@ts-ignore
          value={answers[id]}
        />
      case 3:
        return <MultipleChoiceField 
          disabled={status?true:false} 
          className={classes.field} 
          key={`field ${id}`} 
          //@ts-ignore
          field={field} 
          change={handleChange} 
          //@ts-ignore
        value={answers[id]}
        />
      default:
        return <h2>Problem with Field type</h2>
    }
  }
  return (
    <Container className={classes.formWrapper}>
      <form className={classes.form} onSubmit={handleSubmit}>
        {status === 'success' && 
        <section className={classes.header}>
        {`Well done, form  "${name}" has been submitted. You may view and edit your results`}
        </section>
        }
        <section className={classes.header}>
          <h1 className={classes.title}>{name}</h1>
          <h2 className={classes.teacherName}>{`By: ${capitalize(Teacher.firstName)} ${capitalize(Teacher.lastName)}`}</h2>
        </section>
          {Fields.map<JSX.Element|undefined>((field, index) => {
            const {id,title,typeId} = field
            return <section key={title+id} className={classes.field}>
              {getField(typeId,field,id)}
            </section>
            
          })}
          <div>
            <Button className={classes.submit} 
            variant="outlined"
            type="submit"
            disabled={status==='success'} 
            
            >
              Submit Form
            </Button>
            <Button 
            className={classes.reset} 
            variant="outlined" color="secondary" 
            onClick={()=>{status
              ? setStatus(undefined)
              : reset()
            }}
            type="reset"
            >
             {status?'edit':'reset'}
            </Button>
          </div>
      </form>
    </Container>
  )
};
//@ts-ignore
export default (FormPage);
