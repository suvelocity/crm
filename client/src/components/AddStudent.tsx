import React, { useMemo, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import network from "../helpers/network";
import {
  validEmailRegex,
  validNameRegex,
  validPhoneNumberRegex,
  onlyNumbersRegex,
} from "../helpers/patterns";
import DoneIcon from "@material-ui/icons/Done";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { FormHelperText, MenuItem, NativeSelect } from "@material-ui/core";
import {
  GridDiv,
  Wrapper,
  TitleWrapper,
  H1,
  Center,
} from "../styles/styledComponents";
import { IStudent } from "../typescript-utils/interfaces";
import { useHistory } from "react-router-dom";

function AddStudent() {
  const [classesData, setClassesData] = useState<any[]>([]); //TODO change type later
  const { register, handleSubmit, errors } = useForm();
  const history = useHistory();

  //Add request to get all available classes
  const getClasses = useCallback(async () => {
    try {
      const classes = await network.get("/api/v1/classes/all-ids-names");
    } catch (e) {
      alert("error ocurred");
    }
  }, []);

  const empty = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const onSubmit = async (data: Omit<IStudent, "id">) => {
    try {
      console.log(data);
      return;
      await network.post("/api/v1/student", data);
      history.push("/student/all");
    } catch (e) {
      alert("error occurred");
    }
  };

  return (
    <Wrapper>
      <Center>
        <TitleWrapper>
          <H1>Add Student</H1>
        </TitleWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <GridDiv>
            <div>
              <TextField
                id="firstName"
                name="firstName"
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
                  <Tooltip title={errors.firstName.message}>
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineIcon
                        style={{ width: "30px", height: "30px" }}
                        color="error"
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <IconButton style={{ cursor: "default" }}>
                    <DoneIcon color="action" />
                  </IconButton>
                )
              ) : null}
              <br />
              <TextField
                id="lastName"
                name="lastName"
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
                  <Tooltip title={errors.lastName.message}>
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineIcon
                        style={{ width: "30px", height: "30px" }}
                        color="error"
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <IconButton style={{ cursor: "default" }}>
                    <DoneIcon color="action" />
                  </IconButton>
                )
              ) : null}
              <br />
              <TextField
                id="idNumber"
                name="idNumber"
                inputRef={register({
                  required: "ID number is required",
                  minLength: {
                    value: 9,
                    message: "ID need to be 9 letters long",
                  },
                  maxLength: {
                    value: 9,
                    message: "ID need to be 9 letters long",
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
                  <Tooltip title={errors.idNumber.message}>
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineIcon
                        style={{ width: "30px", height: "30px" }}
                        color="error"
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <IconButton style={{ cursor: "default" }}>
                    <DoneIcon color="action" />
                  </IconButton>
                )
              ) : null}
              <br />
              <TextField
                id="email"
                label="Email"
                name="email"
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
                  <Tooltip title={errors.email.message}>
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineIcon
                        style={{ width: "30px", height: "30px" }}
                        color="error"
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <IconButton style={{ cursor: "default" }}>
                    <DoneIcon color="action" />
                  </IconButton>
                )
              ) : null}
              <br />
              <TextField
                id="phone"
                name="phone"
                inputRef={register({
                  required: "Phone is required",
                  pattern: {
                    value: validPhoneNumberRegex,
                    message: "invalid phone number",
                  },
                })}
                label="Phone Number"
              />
              {!empty ? (
                errors.phone ? (
                  <Tooltip title={errors.phone.message}>
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineIcon
                        style={{ width: "30px", height: "30px" }}
                        color="error"
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <IconButton style={{ cursor: "default" }}>
                    <DoneIcon color="action" />
                  </IconButton>
                )
              ) : null}
              <TextField
                id="class"
                name="class"
                inputRef={register({ required: "Class is required" })}
                label="Class"
              />
              {!empty ? (
                errors.class ? (
                  <Tooltip title={errors.class.message}>
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineIcon
                        style={{ width: "30px", height: "30px" }}
                        color="error"
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <IconButton style={{ cursor: "default" }}>
                    <DoneIcon color="action" />
                  </IconButton>
                )
              ) : null}
              <br />
              <TextField
                id="address"
                name="address"
                inputRef={register({ required: "Address is required" })}
                label="Address"
              />
              {!empty ? (
                errors.address ? (
                  <Tooltip title={errors.address.message}>
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineIcon
                        style={{ width: "30px", height: "30px" }}
                        color="error"
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <IconButton style={{ cursor: "default" }}>
                    <DoneIcon color="action" />
                  </IconButton>
                )
              ) : null}
              <br />
              <TextField
                id="age"
                name="age"
                inputRef={register({
                  required: "Age is required",
                  pattern: {
                    value: onlyNumbersRegex,
                    message: "Age can have only numbers",
                  },
                })}
                label="Age"
              />
              {!empty ? (
                errors.age ? (
                  <Tooltip title={errors.age.message}>
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineIcon
                        style={{ width: "30px", height: "30px" }}
                        color="error"
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <IconButton style={{ cursor: "default" }}>
                    <DoneIcon color="action" />
                  </IconButton>
                )
              ) : null}
              <br />
              <TextField
                id="maritalState"
                select
                label="Marital State"
                name="maritalState"
                inputRef={register({
                  required: "Marital state is required",
                })}
              >
                <MenuItem>Single</MenuItem>
                <MenuItem>Married</MenuItem>
                <MenuItem>divorced </MenuItem>
                <MenuItem>widowed </MenuItem>
                <MenuItem>It's complicated</MenuItem>
              </TextField>
              {!empty ? (
                errors.maritalState ? (
                  <Tooltip title={errors.maritalState.message}>
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineIcon
                        style={{ width: "30px", height: "30px" }}
                        color="error"
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <IconButton style={{ cursor: "default" }}>
                    <DoneIcon color="action" />
                  </IconButton>
                )
              ) : null}
              <br />
              <TextField
                id="children"
                name="children"
                type="number"
                label="Number of children"
                defaultValue={0}
                inputRef={register({
                  min: {
                    value: 0,
                    message: "Negative children are not allowed",
                  },
                  max: { value: 15, message: "Sorry, no more than 15 kids" },
                })}
              />
              {!empty ? (
                errors.children ? (
                  <Tooltip title={errors.children.message}>
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineIcon
                        style={{ width: "30px", height: "30px" }}
                        color="error"
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <IconButton style={{ cursor: "default" }}>
                    <DoneIcon color="action" />
                  </IconButton>
                )
              ) : null}
              {/* optional: another field pops out in case of a degree, where you can specify what degree */}
            </div>
            <div>
              <TextField
                id="academicBackground"
                // className={classes.selectEmpty}
                select
                label="Academic Background"
                value={""}
                name="academicBackground"
                // onChange={handleChange}
                // inputProps={{ "aria-label": "age" }}
              >
                <MenuItem>No education</MenuItem>
                <MenuItem>Middle school</MenuItem>
                <MenuItem>High school diploma </MenuItem>
                <MenuItem>Bachelor's degree</MenuItem>
                <MenuItem>Master's degree</MenuItem>
              </TextField>
              <br />
              <TextField
                id="languages"
                name="languages"
                inputRef={register({
                  required: "Languages is required",
                  pattern: {
                    value: validNameRegex,
                    message:
                      "Languages can have only letters seperated by spaces",
                  },
                })}
                label="Languages"
              />
              {!empty ? (
                errors.languages ? (
                  <Tooltip title={errors.languages.message}>
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineIcon
                        style={{ width: "30px", height: "30px" }}
                        color="error"
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <IconButton style={{ cursor: "default" }}>
                    <DoneIcon color="action" />
                  </IconButton>
                )
              ) : null}
              <TextField
                id="citizenships"
                name="citizenships"
                inputRef={register({
                  required: "Citizenships is required",
                  pattern: {
                    value: validNameRegex,
                    message:
                      "Citizenships can have only letters seperated by spaces",
                  },
                })}
                label="Citizenships"
              />
              {!empty ? (
                errors.citizenships ? (
                  <Tooltip title={errors.citizenships.message}>
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineIcon
                        style={{ width: "30px", height: "30px" }}
                        color="error"
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <IconButton style={{ cursor: "default" }}>
                    <DoneIcon color="action" />
                  </IconButton>
                )
              ) : null}
              <br />
              <br />
              <TextField
                id="additionalDetails"
                multiline
                rows={4}
                variant="outlined"
                style={{ width: "196px" }}
                name="additionalDetails"
                inputRef={register()}
                label="Additional Details"
              />
              <br />
              <br />
              <TextField
                id="militaryService"
                multiline
                rows={3}
                variant="outlined"
                style={{ width: "196px" }}
                name="militaryService"
                inputRef={register()}
                label="Military Service"
              />{" "}
              <br />
              <br />
              <TextField
                id="workExperience"
                multiline
                rows={3}
                variant="outlined"
                style={{ width: "196px" }}
                name="workExperience"
                inputRef={register()}
                label="Work Experience"
              />
            </div>
          </GridDiv>
          <br />
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
