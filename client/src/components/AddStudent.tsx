import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import network from "../helpers/network";
import { validEmailRegex, validPhoneNumberRegex } from "../helpers/patterns";
import CloseIcon from "@material-ui/icons/Close";
import WarningIcon from "@material-ui/icons/Warning";
import DoneIcon from "@material-ui/icons/Done";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import CircularProgress from "@material-ui/core/CircularProgress";

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
  console.log(errors == undefined);

  const empty = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const onSubmit = (data: IStudent) => {
    console.log(data);
    //await network.post('/students', data);
  };

  return (
    <div>
      <h1>Add Student</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          name="email"
          ref={register({
            required: "Email is required",
            pattern: {
              value: validEmailRegex,
              message: "Please Enter a Valid Email",
            },
          })}
          placeholder="Email"
        />
        {!empty ? (
          errors.email ? (
            <ErrorOutlineIcon color="error" />
          ) : (
            <DoneIcon color="action" />
          )
        ) : null}
        {errors.email && errors.email.message}
        <br />
        <input
          name="firstName"
          ref={register({ required: "First name is required" })}
          placeholder="First Name"
        />
        {!empty ? (
          errors.firstName ? (
            <ErrorOutlineIcon color="error" />
          ) : (
            <DoneIcon color="action" />
          )
        ) : null}
        {errors.firstName && errors.firstName.message}
        <br />
        <input
          name="lastName"
          ref={register({ required: "Last Name is required" })}
          placeholder="Last Name"
        />
        {!empty ? (
          errors.lastName ? (
            <ErrorOutlineIcon color="error" />
          ) : (
            <DoneIcon color="action" />
          )
        ) : null}
        {errors.lastName && errors.lastName.message}
        <br />
        <input
          name="phone"
          ref={register({
            required: "Phone is required",
            pattern: {
              value: validPhoneNumberRegex,
              message: "invalid phone number",
            },
          })}
          placeholder="Phone Number"
        />
        {!empty ? (
          errors.phone ? (
            <ErrorOutlineIcon color="error" />
          ) : (
            <DoneIcon color="action" />
          )
        ) : null}
        {errors.phone && errors.phone.message}
        <br />
        <input
          name="idNumber"
          ref={register({ required: "ID Number is required" })}
          placeholder="ID Number"
        />
        {!empty ? (
          errors.idNumber ? (
            <ErrorOutlineIcon color="error" />
          ) : (
            <DoneIcon color="action" />
          )
        ) : null}
        {errors.idNumber && errors.idNumber.message}
        <br />
        <input
          name="description"
          ref={register({ required: "Description is required" })}
          placeholder="Description"
        />
        {!empty ? (
          errors.description ? (
            <ErrorOutlineIcon color="error" />
          ) : (
            <DoneIcon color="action" />
          )
        ) : null}
        {errors.description && errors.description.message}
        <br />
        <input
          name="course"
          ref={register({ required: "Course is required" })}
          placeholder="Course"
        />
        {!empty ? (
          errors.course ? (
            <ErrorOutlineIcon color="error" />
          ) : (
            <DoneIcon color="action" />
          )
        ) : null}
        {errors.course && errors.course.message}
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddStudent;
