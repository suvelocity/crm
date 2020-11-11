import React, { useMemo } from "react";
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
import { Wrapper, TitleWrapper, H1, Center } from "../styles/styledComponents";
import { IStudent } from "../typescript/interfaces";
import { useHistory } from "react-router-dom";

function AddStudent() {
  const { register, handleSubmit, errors } = useForm();
  const history = useHistory();

  const empty = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const onSubmit = async (data: Omit<IStudent, "id">) => {
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
          <Tooltip title="hell">
            <H1>Add Student</H1>
          </Tooltip>
        </TitleWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
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
            name="lastName"
            inputRef={register({
              required: "Last Name is required",
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
            name="idNumber"
            inputRef={register({
              required: "ID Number is required",
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
          <br />
          <TextField
            multiline
            rows={4}
            variant="outlined"
            style={{ width: "196px" }}
            name="description"
            inputRef={register({ required: "Description is required" })}
            label="Description"
          />
          {!empty ? (
            errors.description ? (
              <Tooltip title={errors.description.message}>
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
          <br />
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </form>
      </Center>
    </Wrapper>
  );
}

export default AddStudent;
