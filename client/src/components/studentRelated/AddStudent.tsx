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
import { IStudent, IClass } from "../../typescript/interfaces";
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
function AddStudent(props: Props) {
  const { register, handleSubmit, errors, control } = useForm();
  const [classes, setClasses] = useState<IClass[]>([]);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      try {
        const { data }: { data: IClass[] } = await network.get(
          "/api/v1/class/all"
        );
        setClasses(data);
      } catch (error) {
        Swal.fire("Error Occurred", error.message, "error");
      }
    })();
  }, [setClasses]);

  const empty = Object.keys(errors).length === 0;

  const onSubmit = async (data: IStudent) => {
    //@ts-ignore
    data.languages = data.languages.join(", ");
    try {
      if (props.update && props.student) {
        await network.patch(`/api/v1/student/${props.student.id}`, data);
        props.handleClose && props.handleClose();
        // history.push(`/company/${props.company.id}`);
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
              {!empty ? (
                errors.firstName ? (
                  <ErrorBtn tooltipTitle={errors.firstName.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
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
              {!empty ? (
                errors.lastName ? (
                  <ErrorBtn tooltipTitle={errors.lastName.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
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
              {!empty ? (
                errors.idNumber ? (
                  <ErrorBtn tooltipTitle={errors.idNumber.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
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
              {!empty ? (
                errors.email ? (
                  <ErrorBtn tooltipTitle={errors.email.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
              <br />
              <TextField
                id="phone"
                name="phone"
                defaultValue={props.student ? props.student.phone : ""}
                inputRef={register({
                  required: "Phone is required",
                  pattern: {
                    value: validPhoneNumberRegex,
                    message: "Invalid phone number",
                  },
                })}
                label="Phone Number"
              />
              {!empty ? (
                errors.phone ? (
                  <ErrorBtn tooltipTitle={errors.phone.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
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
                    props.student ? props.student.languages.split(", ") : []
                  }
                />
              </FormControl>
              {!empty ? (
                errors.languages ? (
                  <ErrorBtn tooltipTitle={errors.languages.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
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
              {!empty ? (
                errors.resumeLink ? (
                  <ErrorBtn tooltipTitle={errors.resumeLink.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
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
              {!empty ? (
                errors.classId ? (
                  <ErrorBtn tooltipTitle={errors.classId.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
              <br />
              {!empty ? (
                errors.address ? (
                  <ErrorBtn tooltipTitle={errors.address.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
              <GoogleMaps
                id="address"
                name="address"
                defaultValue={props.student ? props.student.address : ""}
                inputRef={register({ required: "Address is required" })}
                label="Address"
              />
              <TextField
                id="age"
                name="age"
                defaultValue={props.student ? props.student.age : ""}
                inputRef={register({
                  required: "Age is required",
                  pattern: {
                    value: onlyNumbersRegex,
                    message: "Age needs to be a number",
                  },
                })}
                label="Age"
              />
              {!empty ? (
                errors.age ? (
                  <ErrorBtn tooltipTitle={errors.age.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
              <br />
              <TextField
                id="maritalStatus"
                name="maritalStatus"
                defaultValue={props.student ? props.student.maritalStatus : ""}
                inputRef={register()}
                label="Marital Status"
              />
              {!empty ? (
                errors.maritalStatus ? (
                  <ErrorBtn tooltipTitle={errors.maritalStatus.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
              <br />
              <TextField
                id="children"
                name="children"
                type="number"
                label="Number of children"
                defaultValue={props.student ? props.student.children : 0}
                inputRef={register({
                  required: "Number of children is required",
                  min: {
                    value: 0,
                    message: "Negative children are not allowed",
                  },
                  max: { value: 25, message: "Sorry, no more than 25 kids" },
                })}
              />
              {!empty ? (
                errors.children ? (
                  <ErrorBtn tooltipTitle={errors.children.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
              <br />
              <TextField
                id="citizenship"
                name="citizenship"
                defaultValue={props.student ? props.student.citizenship : ""}
                inputRef={register()}
                label="Citizenship"
              />
              {!empty ? (
                errors.citizenship ? (
                  <ErrorBtn tooltipTitle={errors.citizenship.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
            </div>
          </GridDiv>
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
          {generateBrs(2)}

          <TextField
            id="academicBackground"
            multiline
            fullWidth
            defaultValue={props.student ? props.student.academicBackground : ""}
            rows={4}
            variant="outlined"
            name="academicBackground"
            inputRef={register()}
            label="Academic Background"
          />
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
