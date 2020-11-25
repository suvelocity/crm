import React, { useMemo, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import network from "../../helpers/network";
import {
  validEmailRegex,
  validNameRegex,
  validPhoneNumberRegex,
  onlyNumbersRegex,
} from "../../helpers/patterns";
import DoneIcon from "@material-ui/icons/Done";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
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

function AddStudent() {
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
      } catch (e) {
        alert(e);
      }
    })();
  }, [setClasses]);

  const empty = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const onSubmit = async (data: IStudent) => {
    try {
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
              <br />
              <TextField
                id="languages"
                name="languages"
                inputRef={register({
                  required: "Languages is required",
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
              <br />
              <br />
              <TextField
                id="academicBackground"
                multiline
                rows={3}
                variant="outlined"
                name="academicBackground"
                inputRef={register()}
                label="Academic Background"
              />
              <br />
              <br />
              <TextField
                id="workExperience"
                multiline
                rows={3}
                variant="outlined"
                name="workExperience"
                inputRef={register()}
                label="Work Experience"
              />
            </div>
            <div>
              <FormControl
                style={{ minWidth: 200 }}
                error={Boolean(errors.classId)}
              >
                <InputLabel>Please select a class</InputLabel>
                <Controller
                  as={
                    <Select>
                      {classes.map((clss: IClass) => (
                        <MenuItem key={clss.id} value={clss.id}>
                          {clss.name}
                        </MenuItem>
                      ))}
                    </Select>
                  }
                  name="classId"
                  rules={{ required: "Class is required" }}
                  control={control}
                  defaultValue=""
                />
              </FormControl>
              {!empty ? (
                errors.classId ? (
                  <Tooltip title={errors.classId.message}>
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
                    message: "Age needs to be a number",
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
                id="maritalStatus"
                name="maritalStatus"
                inputRef={register({ required: "Marital status is required" })}
                label="Marital Status"
              />
              {!empty ? (
                errors.maritalStatus ? (
                  <Tooltip title={errors.maritalStatus.message}>
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
                  max: { value: 25, message: "Sorry, no more than 25 kids" },
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
              <br />
              <TextField
                id="citizenship"
                name="citizenship"
                inputRef={register({
                  required: "Citizenship is required",
                })}
                label="Citizenship"
              />
              {!empty ? (
                errors.citizenship ? (
                  <Tooltip title={errors.citizenship.message}>
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
                id="militaryService"
                multiline
                rows={3}
                variant="outlined"
                name="militaryService"
                inputRef={register()}
                label="Military Service"
              />
              <br />
              <br />
              <TextField
                id="additionalDetails"
                multiline
                rows={3}
                variant="outlined"
                name="additionalDetails"
                inputRef={register()}
                label="Additional Details"
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