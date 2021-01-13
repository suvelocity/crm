import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import network from "../../helpers/network";
import {
  validEmailRegex,
  validNameRegex,
  validPhoneNumberRegex,
  onlyNumbersRegex,
} from "../../helpers";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import Swal from "sweetalert2";
import InputLabel from "@material-ui/core/InputLabel";
import {
  GridDiv,
  Wrapper,
  TitleWrapper,
  H1,
  Center,
} from "../../styles/styledComponents";
import { IStudent, IClass, IAcademicBackground } from "../../typescript/interfaces";
import { useHistory } from "react-router-dom";
import { ActionBtn, ErrorBtn } from "../formRelated";
import GoogleMaps from "../GeoSearch";
import languages from "../../helpers/languages.json";
interface Props {
  student?: IStudent;
  header?: string;
  update?: boolean;
  handleClose?: Function;
}
export const academicKeys = ['institution','studyTopic', 'degree', 'averageScore']
export const camelCaseToWords = (word: string): string =>{
  const regex = /[A-Z]/g;
  let result = word[0].toUpperCase();
  for(let i = 1; i < word.length; i++){
    const letter = word[i];
    if(letter.match(regex)){
      result += " ";
    }
    result += letter;
  }
  return result;
}
function AddStudent(props: Props) {
  const { register, handleSubmit, errors, control, getValues, setValue, reset } = useForm();
  const [classes, setClasses] = useState<IClass[]>([]);
  const [academicBackgrounds, setAcademicBackgrounds] = useState<IAcademicBackground[]>((props.student && props.student.AcademicBackgrounds) ? props.student.AcademicBackgrounds: [])
  const history = useHistory();
  const lists ={
    institution:[
      "אוניברסיטה עברית",
      "אוניברסיטת תל אביב",
     " אוניברסיטת בן גוריון",
     " אוניברסיטת בר אילן",
     " האוניברסיטה הפתוחה",
     " אוניברסיטת חיפה",
     " טכניון",
     " מכללת סמי שמעון",
     " מכללת עזריאלי",
     " מכון טל",
     " מכון תבונה",
     " מכון הדסה",
     " אורט בראודה",
     " מכללת אריאל",
     " לוסטיג",
     " סמינר ישן",
     " סמינר חדש",
     " סמינר וולף"
    ],
    degree: ['תואר שני', 'תואר ראשון']
  }
  console.log(academicBackgrounds);
  useEffect(() => {
    (async () => {
      try {
        const { data }: { data: IClass[] } = await network.get(
          "/api/v1/class/all"
        );
        setClasses(data);
      } catch (error)  {
        Swal.fire("Error Occurred", error.message, "error");
      }
    })();
  }, [setClasses]);

  const empty = Object.keys(errors).length === 0;
  const errorComponent = (name:string, customBoolean?:boolean) => {
    if(empty) return null
    let check = errors[name]
    if(customBoolean !== undefined){
      check = customBoolean;
    }
    return check ?
    <ErrorBtn tooltipTitle={errors[name].message} />
    :<ActionBtn />
  }
  const onSubmit = async (data: IStudent) => {
    //@ts-ignore
    data.languages = data.languages.join(", ");
    try {
      if (props.update && props.student) {
        if(data.AcademicBackgrounds){
          data.AcademicBackgrounds = returnAcademicFieldValues()
        }
        console.log(data)
        await network.patch(`/api/v1/student/${props.student.id}`, data);
        props.handleClose && props.handleClose();
      } else {
        await network.post("/api/v1/student", data);
        history.push("/student/all");
      }
    } catch (error) {
      if (error.response.status === 409) {
        Swal.fire({
          title: "User with the same id or email already exists",
          icon: "error",
        });
      } else {
        Swal.fire("Error Occurred", error.message, "error");
      }
    }
  };
  const addAcademicBackground = () => {
    const values = getValues()
    let newArr = returnAcademicFieldValues();
    if(newArr.length < 1){
      newArr = [{
        id:undefined,
        institution: "",
        studyTopic: "",
        degree: "",
        averageScore: undefined
        }];
    }else{
      newArr.push({
        //@ts-ignore
        // id: newArr[newArr.length - 1].id + 1,
        id:undefined,
        institution: "",
        studyTopic: "",
        degree: "",
        averageScore: undefined
        });
    }
    console.log(newArr, 'newArr')
    // values['academicBackground'] = newArr.slice()
    setAcademicBackgrounds(newArr.slice());
    // values['academicBackground'] = newArr.slice()
  }
  const removeAcademicBackground = (index: number) => {
    const values = getValues()
    const academic = values['AcademicBackgrounds'];
    const newArr = returnAcademicFieldValues();
    newArr.splice(index, 1);
    // setValue('AcademicBackgrounds', newArr.slice())
    reset({...values, AcademicBackgrounds: newArr.slice()});
    // setValue('AcademicBackgrounds', newArr.slice(), { shouldDirty: true })
    const values2 = getValues()
    console.log(values2, '------------values after')
    setAcademicBackgrounds(newArr.slice());
  }
  const returnAcademicFieldValues = () => {
    const values = getValues()
    const academic = values['AcademicBackgrounds'];
    if(!academic || academic.length === 0){
      return [];
    }
    return academicBackgrounds.map( (academic2: IAcademicBackground, index: number) => {
      const {institution, degree, averageScore, studyTopic} = academic[index];
      const {id} = academic2;
      //...academic2,
      return { id, institution, degree, averageScore, studyTopic}
    }) || [];
  }
  return (
    <Wrapper>
      <Center>
        <TitleWrapper>
          <H1>{props.header ? props.header : "Add Student"}</H1>
        </TitleWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <GridDiv>
            <div>
              <TextField
                id="firstName"
                name="firstName"
                defaultValue={props.student ? props.student.firstName : ""}
                inputRef={register({
                  required: "First name is required",
                  pattern: {
                    value: validNameRegex,
                    message: "First name can have only letters and spaces",
                  },
                  minLength: {
                    value: 2,
                    message: "First name needs to be a minimum of 2 letters",
                  },
                })}
                label="First Name"
              />
              {errorComponent('firstName')}
              <br />
              <TextField
                id="lastName"
                name="lastName"
                defaultValue={props.student ? props.student.lastName : ""}
                inputRef={register({
                  required: "Last name is required",
                  pattern: {
                    value: validNameRegex,
                    message: "Last name can have only letters and spaces",
                  },
                  minLength: {
                    value: 2,
                    message: "Last name needs to be a minimum of 2 letters",
                  },
                })}
                label="Last Name"
              />
              {errorComponent('lastName')}
              <br />
              <TextField
                id="idNumber"
                name="idNumber"
                defaultValue={props.student ? props.student.idNumber : ""}
                inputRef={register({
                  required: "ID number is required",
                  maxLength: {
                    value: 10,
                    message: "ID need to be 9 or 10 letters long",
                  },
                  minLength: {
                    value: 9,
                    message: "ID need to be 9 or 10 letters long",
                  },
                  pattern: {
                    value: onlyNumbersRegex,
                    message: "ID can have only numbers",
                  },
                })}
                label="ID Number"
              />
              {errorComponent('idNumber')}
              <br />
              <TextField
                id="email"
                label="Email"
                name="email"
                defaultValue={props.student ? props.student.email : ""}
                inputRef={register({
                  required: "Email is required",
                  pattern: {
                    value: validEmailRegex,
                    message: "Please Enter a Valid Email",
                  },
                })}
              />
              {errorComponent('email')}
              <br />
              <TextField
                id="phone"
                name="phone"
                defaultValue={props.student ? props.student.phone : ""}
                inputRef={register({
                  // required: "Phone is required",
                  pattern: {
                    value: validPhoneNumberRegex,
                    message: "Invalid phone number",
                  },
                })}
                label="Phone Number"
              />
              {errorComponent('phone')}
              <br />
              <FormControl
                style={{ width: 195 }}
                error={Boolean(errors.languages)}
              >
                <InputLabel>Languages</InputLabel>
                <Controller
                  as={
                    <Select multiple>
                      {Object.keys(languages).map((key: string) => (
                        <MenuItem
                          //@ts-ignore
                          id={languages[key].name}
                          //@ts-ignore
                          key={languages[key].name}
                          //@ts-ignore
                          value={languages[key].name}
                        >
                          {/* @ts-ignore */}
                          {`${languages[key].name}`}
                        </MenuItem>
                      ))}
                    </Select>
                  }
                  id="languages"
                  name="languages"
                  control={control}
                  defaultValue={
                    props.student?.languages
                      ? props.student.languages?.split(", ")
                      : []
                  }
                />
              </FormControl>
              {errorComponent('languages')}
              <br />
              <TextField
                id="resumeLink"
                name="resumeLink"
                defaultValue={props.student ? props.student.resumeLink : ""}
                inputRef={register({
                  maxLength: {
                    value: 500,
                    message: "Resume link needs to be 500 letters max",
                  },
                })}
                label="Resume Link"
              />
              {errorComponent('resumeLink')}
              {generateBrs(2)}
            </div>
            <div>
              <FormControl
                style={{ minWidth: 195 }}
                error={Boolean(errors.classId)}
              >
                <InputLabel>Please select a class</InputLabel>
                <Controller
                  as={
                    <Select>
                      {classes.map((clss: IClass) => (
                        <MenuItem key={clss.id} value={clss.id} id={clss.name}>
                          {clss.name}
                        </MenuItem>
                      ))}
                    </Select>
                  }
                  name="classId"
                  id="classId"
                  rules={{ required: "Class is required" }}
                  control={control}
                  defaultValue={props.student ? props.student.Class.id : ""}
                />
              </FormControl>
              {errorComponent('classId')}
              <br />
              <FormControl
                style={{ minWidth: 195 }}
                error={Boolean(errors.classId)}
              >
                <GoogleMaps
                  id="address"
                  name="address"
                  defaultValue={props.student ? props.student.address : ""}
                  inputRef={register({ required: "Address is required" })}
                  label="Address"
                />
              </FormControl>
              {errorComponent('address')}
              <TextField
                id="age"
                name="age"
                defaultValue={props.student ? props.student.age : 0}
                inputRef={register({
                  pattern: {
                    value: onlyNumbersRegex,
                    message: "Age needs to be a number",
                  },
                })}
                label="Age"
              />
              {errorComponent('age')}
              <br />
              <TextField
                id="maritalStatus"
                name="maritalStatus"
                defaultValue={props.student ? props.student.maritalStatus : ""}
                inputRef={register({
                  required: "Marital Status is required",
                  maxLength: {
                    value: 20,
                    message: "Marital status max length is 20 letters",
                  },
                })}
                label="Marital Status"
              />
              {errorComponent('maritalStatus')}
              <br />
              <TextField
                id="children"
                name="children"
                type="number"
                label="Number of children"
                defaultValue={props.student ? props.student.children : 0}
                inputRef={register({
                  // required: "Number of children is required",
                  min: {
                    value: 0,
                    message: "Negative children are not allowed",
                  },
                  max: { value: 25, message: "Sorry, no more than 25 kids" },
                })}
              />
              {errorComponent('children')}
              <br />
              <TextField
                id="citizenship"
                name="citizenship"
                defaultValue={props.student ? props.student.citizenship : ""}
                inputRef={register()}
                label="Citizenship"
              />
              {errorComponent('citizenship')}
              <br />
              <TextField
                id="fcc_account"
                name="fccAccount"
                defaultValue={props.student ? props.student.fccAccount : ""}
                inputRef={register()}
                label="FreeCodeCamp Account"
              />
              {errorComponent('fccAccount')}
            </div>
          </GridDiv>
          {generateBrs(2)}
          {/* Make it a dropdaown? */}
          {/* <FormControl
                style={{ width: "90%" }}
                error={Boolean(errors.classId)}
              > */}
          {
            <div style ={{margin:"auto", width: "90%", display:'flex', justifyContent: 'flex-start'}}>
              {`Academic Backgrounds: (${academicBackgrounds.length === 0? "?" : academicBackgrounds.length}):`}
              <AddIcon 
              onClick={addAcademicBackground}
              style={{marginLeft:'3%'}}
              />
            </div>
          }
          {generateBrs(1)}
          {
            academicBackgrounds.map((background: IAcademicBackground, index:number) => <>
                <div style ={{margin:"auto", width: "80%", display:'flex', justifyContent: 'space-between'}}>
                  {`Background ${index+1} :`}
                  {<DeleteIcon 
                    onClick={async() => {
                      if(background.id !== undefined && props.student){
                        const {data} = await network.delete(`/api/v1/student/academicBackground/${background.id}?studentId=${props.student.id}`)
                        console.log(data)
                        setAcademicBackgrounds(data)
                      }else{
                        removeAcademicBackground(index)
                      }}}
                    style={{marginRight:'14%'}}
                  />}
                </div>
                <br />
                <GridDiv style= {{margin:"auto", width: "80%"}}>
                {
                academicKeys.map((key: string) =>{
                  //@ts-ignore
                return (key === 'averageScore' || key === 'studyTopic') ?<div>
                    <TextField style={{width:"70%"}}
                      id={`AcademicBackgrounds[${index}][${key}]${index}`}
                      name={`AcademicBackgrounds[${index}][${key}]`}
                      //@ts-ignore
                      defaultValue={ background[key] || ""}
                      inputRef={register({
                      //@ts-ignore
                        required: `${key} is required`,
                        valueAsNumber: key === 'averageScore'? true : false,
                        pattern: {
                          value: key === 'averageScore'? onlyNumbersRegex : true,
                          message: "Average Score can have only numbers",
                        },
                      })}
                      label={camelCaseToWords(key)}
                    />
                    {!empty ? (
                      (errors.academicBackground && 
                       errors.academicBackground[index]&&
                       errors.academicBackground[index][key]) ? (
                        <ErrorBtn tooltipTitle={errors.academicBackground[index][key].message} />
                      ) : (
                        <ActionBtn />
                      )
                    ) : null}
                  </div>
                :<div>
                <FormControl
                style={{ minWidth: 195 }}
                error={Boolean(errors.classId)}
              >
                <InputLabel>{`Select a ${camelCaseToWords(key)}`}</InputLabel>
                <Controller
                  as={
                    <Select>
                      {//@ts-ignore
                      lists[key].map((value: string) => (
                        <MenuItem key={value} value={value} id={value}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  }
                  id={`AcademicBackgrounds[${index}][${key}]${Math.random()}`}
                  name={`AcademicBackgrounds[${index}][${key}]`}
                  rules={{ required: `${key} is required` }}
                  control={control}
                  //@ts-ignore
                  defaultValue={academicBackgrounds[index][key] || ""}
                />
              </FormControl>
              {!empty ? (
                (errors.academicBackground && 
                errors.academicBackground[index]&&
                errors.academicBackground[index][key]) ? (
                  <ErrorBtn tooltipTitle={errors.academicBackground[index][key].message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
              </div>  
                })
                }
                </GridDiv>
                {generateBrs(2)}
              </>)
          }
          {generateBrs(2)}
          <TextField
            id="militaryService"
            multiline
            defaultValue={props.student ? props.student.militaryService : ""}
            fullWidth
            rows={4}
            variant="outlined"
            name="militaryService"
            inputRef={register({
              maxLength: {
                value: 500,
                message: "Military Service is too long",
              },
            })}
            label="Military Service"
          />
          {errorComponent('militaryService')}
          {generateBrs(2)}

          <TextField
            id="workExperience"
            multiline
            fullWidth
            defaultValue={props.student ? props.student.workExperience : ""}
            rows={4}
            variant="outlined"
            name="workExperience"
            inputRef={register({
              maxLength: {
                value: 500,
                message: "Work Experience is too long",
              },
            })}
            label="Work Experience"
          />
          {errorComponent('workExperience')}
          {generateBrs(2)}
          <TextField
            id="additionalDetails"
            multiline
            fullWidth
            defaultValue={props.student ? props.student.additionalDetails : ""}
            rows={4}
            variant="outlined"
            name="additionalDetails"
            inputRef={register({
              maxLength: {
                value: 500,
                message: "Additional Details are too long",
              },
            })}
            label="Additional Details"
          />
          {errorComponent('additionalDetails')}
          {generateBrs(2)}
          <Button
            id="submitButton"
            variant="contained"
            color="primary"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Center>
    </Wrapper>
  );
}

export default AddStudent;

const generateBrs = (num: number): JSX.Element[] => {
  const arrOfSpaces = [];
  for (let i = 0; i < num; i++) {
    arrOfSpaces.push(<br />);
  }
  return arrOfSpaces;
};
