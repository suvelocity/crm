import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import network from "../helpers/network";
import { validEmailRegex, validPhoneNumberRegex } from "../helpers/patterns";
import CloseIcon from "@material-ui/icons/Close";
import WarningIcon from "@material-ui/icons/Warning";
import DoneIcon from "@material-ui/icons/Done";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

import styled from "styled-components";

interface IStudent {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  idNumber: string;
  description: string;
  course: any; // Change This.
}

function AddStudent() {
  const { register, handleSubmit, errors } = useForm();

  const empty = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const onSubmit = (data: IStudent) => {
    console.log(data);
    //await network.post('/students', data);
  };

  return (
    <Wrapper>
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
          inputRef={register({ required: "First name is required" })}
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
          inputRef={register({ required: "Last Name is required" })}
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
          inputRef={register({ required: "ID Number is required" })}
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
          multiline
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
          name="course"
          inputRef={register({ required: "Course is required" })}
          label="Course"
        />
        {!empty ? (
          errors.course ? (
            <Tooltip title={errors.course.message}>
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
    </Wrapper>
  );
}

export default AddStudent;

export const H1 = styled.h1`
  padding: 5px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 27px;
  color: white;
  position: relative;
  left: -50%;
  top: -80px;
  background-color: #3f51b5;
  border-radius: 5px;
  padding: 10px;
  min-width: 180px;
  box-shadow: 5px 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
  z-index: 2;
`;

export const TitleWrapper = styled.div`
  position: absolute;
  left: 50%;
`;

export const Wrapper = styled.div`
  margin: 5% auto;
  width: 70%;
  text-align: center;
  padding: 40px;
  border-radius: 7px;
  box-shadow: 5px 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
  min-width: 300px;
  max-width: 700px;
`;
