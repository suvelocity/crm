import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
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
import {execSwalConfirmation} from '../../helpers';
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


let arr = [];
const lists: {institution:string[], degree:string[], averageScore:number[]} ={
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
   " מכון לב",
   " מכון תבונה",
   " מכון הדסה",
   " אורט בראודה",
   " מכללת אריאל",
   " לוסטיג",
   " סמינר ישן",
   " סמינר חדש",
   " סמינר וולף"
  ],
  degree: ['תואר שני', 'תואר ראשון'],
  averageScore:[]
}
for(let i = 100; i >=56; i--){
  lists.averageScore.push(i)
}

function AddStudent(props: Props) {
  const { register, handleSubmit, errors, control, setError, clearErrors, getValues, setValue, reset } = useForm();
  const { fields : AcademicBackgrounds, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: "AcademicBackgrounds"
  });
  const [classes, setClasses] = useState<IClass[]>([]);
  // const [academicBackgrounds, setAcademicBackgrounds] = useState<IAcademicBackground[]>((props.student && props.student.AcademicBackgrounds) ? props.student.AcademicBackgrounds: [])
  const history = useHistory();

  const academicBackgroundError = (index: number, key: string) => {
    return !empty ? (
      (errors.AcademicBackgrounds && 
       errors.AcademicBackgrounds[index]&&
       errors.AcademicBackgrounds[index][key]) ? (
        <ErrorBtn tooltipTitle={errors.AcademicBackgrounds[index][key].message} />
      ) : (
        <ActionBtn />
      )
    ) : null
  }
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
  useEffect(() => {
    if(props.student && props.student.AcademicBackgrounds){
      append(props.student.AcademicBackgrounds)
    }
  },[])

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
          data.AcademicBackgrounds = data.AcademicBackgrounds.map((academic:IAcademicBackground, index:number) => {
            return {...academic, id: AcademicBackgrounds[index].id}
          })
        }
        await network.patch(`/api/v1/student/${props.student.id}`, data);
        props.handleClose && props.handleClose();
      } else {
        await network.post("/api/v1/student", data);
        history.push("/student/all");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
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
    append({
      institution: "",
      studyTopic: "",
      degree: "",
      averageScore: undefined
      })
  }
  const checkEmailIsUnique = async (email:string) => {
    if(!validEmailRegex.test(email)) return setError('email', {
      type: 'manual',
      message: "Please Enter a Valid Email"
    })
    let query = `/api/v1/student/ByEmail/?email=${email}`;
    if(props.student){
      query += `&&validId=${props.student.id}`;
    }
    try{
      const {data} = await network.get(`${query}`);
      if(!data.available){
        setError('email', {
          type: "manual",
          message: "A Student Already Exists With This Email"
        })
      }else{
        console.log(data);
        clearErrors('email');
      }
    }catch(e){
      console.log(e);
      setError("email", {
        type: "manual",
        message: e
      })
    }
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
                onChange={(e) => checkEmailIsUnique(e.target.value) }
                defaultValue={props.student ? props.student.email : ""}
                inputRef={register({
                  required: "Email is required",
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
                defaultValue={props.student ? props.student.age : null}
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
              {`Academic Backgrounds: (${AcademicBackgrounds.length === 0? "?" : AcademicBackgrounds.length}):`}
              <AddIcon 
              onClick={addAcademicBackground}
              style={{marginLeft:'3%'}}
              />
            </div>
          }
          {generateBrs(1)}

          {
            AcademicBackgrounds.map((background: IAcademicBackground, index:number) => <div key={background.id}>
                <div style ={{margin:"auto", width: "80%", display:'flex', justifyContent: 'space-between'}}>
                  {`Background ${index+1} :`}
                  {<DeleteIcon
                    onClick={async() => {
                      if(typeof background.id === "number" && props.student){
                        // execSwalConfirmation()
                        // .then(async (result: { isConfirmed: boolean }) => {
                        //   if (result.isConfirmed && props.student) {
                        await network.delete(`/api/v1/student/academicBackground/${background.id}?studentId=${props.student.id}`)
                        remove(index)
                          // }
                        // });
                      }else{
                        remove(index)
                      }}}
                    style={{marginRight:'8%'}}
                  />}
                </div>
                <br />
                <GridDiv style= {{margin:"auto", width: "80%"}}>
                  <div>
                  <FormControl
                        style={{ minWidth: 195 }}
                      >
                      <InputLabel>{`Institution`}</InputLabel>
                      <Controller
                        as={
                          <Select>
                            {//@ts-ignore
                            lists.institution.map((value: string) => (
                              <MenuItem key={value} value={value} id={value}>
                                {value}
                              </MenuItem>
                            ))}
                          </Select>
                        }
                        name={`AcademicBackgrounds[${index}].institution`}
                        rules={{ required: `Institution is required`}}
                        control={control}
                        //@ts-ignore
                        defaultValue={background.institution || ""}
                      />
                    </FormControl>
                    {academicBackgroundError(index, 'institution')}
                    <FormControl
                        style={{ minWidth: 195 }}
                      >
                      <InputLabel>{`Degree`}</InputLabel>
                      <Controller
                        as={
                          <Select>
                            {//@ts-ignore
                            lists.degree.map((value: string) => (
                              <MenuItem key={value} value={value} id={value}>
                                {value}
                              </MenuItem>
                            ))}
                          </Select>
                        }
                        name={`AcademicBackgrounds[${index}].degree`}
                        rules={{ required: `Degree is required`}}
                        control={control}
                        //@ts-ignore
                        defaultValue={background.degree || ""}
                      />
                    </FormControl>
                    {academicBackgroundError(index, 'degree')}
                  </div>
                    <div>
                    <Controller
                      as={<TextField style={{width:"70%"}}/>}
                      name={`AcademicBackgrounds[${index}].studyTopic`}
                      //@ts-ignore
                      defaultValue={ background.studyTopic || ""}
                      control={control}
                      rules={{ required: `Study Topic is required`}}
                      label='Study Topic'
                    />
                    {academicBackgroundError(index, 'studyTopic')}
                      <FormControl
                        style={{ minWidth: 195 }}
                      >
                      <InputLabel>{`Average Score`}</InputLabel>
                      <Controller
                        as={
                          <Select>
                            {//@ts-ignore
                            lists.averageScore.map((value: string) => (
                              <MenuItem key={value} value={Number(value)} id={value}>
                                {value}
                              </MenuItem>
                            ))}
                          </Select>
                        }
                        name={`AcademicBackgrounds[${index}].averageScore`}
                        rules={{ required: `Average Score is required`}}
                        control={control}
                        //@ts-ignore
                        defaultValue={background.averageScore || ""}
                      />
                    </FormControl>
                    {academicBackgroundError(index, 'averageScore')}
                  </div>
                </GridDiv>
                {generateBrs(2)}
              </div>)
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
