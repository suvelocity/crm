import React, { useMemo, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import network from "../../helpers/network";
import { TextField, Button, Tooltip, InputLabel } from "@material-ui/core";
import {
  Wrapper,
  TitleWrapper,
  H1,
  Center,
  GridDiv,
} from "../../styles/styledComponents";
import { useHistory } from "react-router-dom";
import { ITeacher, ICompany } from "../../typescript/interfaces";
import {
  validEmailRegex,
  validNameRegex,
  validPhoneNumberRegex,
  onlyNumbersRegex,
} from "../../helpers";
import { FormControl, MenuItem, Select } from "@material-ui/core";
import { ErrorBtn, ActionBtn } from "../formRelated";
import Swal from "sweetalert2";
import GoogleMaps from "../GeoSearch";
interface Props {
  teacher?: ITeacher;
  header?: string;
  update?: boolean;
  handleClose?: Function;
}
const AddTeacher = (props: Props) => {
  const { register, handleSubmit, setValue, errors, control } = useForm();
  const history = useHistory();

  const empty = Object.keys(errors).length === 0;

  const onSubmit = async (data: Omit<ITeacher, "id">) => {
    try {
      if (props.update && props.teacher) {
        await network.patch(`/api/v1/teacher/${props.teacher.id}`, data);
        props.handleClose && props.handleClose();
        // history.push(`/company/${props.company.id}`);
      } else {
        await network.post("/api/v1/teacher", data);
        history.push("/teacher/all");
      }
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
  };

  return (
    <Wrapper width="50%">
      <Center>
        <TitleWrapper>
          <H1 color="#2fbd76">{props.header ? props.header : "Add Teacher"}</H1>
        </TitleWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <GridDiv repeatFormula="1fr 1fr">
            <div>
              <TextField
                id="firstName"
                name="firstName"
                defaultValue={props.teacher ? props.teacher.firstName : ""}
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
                defaultValue={props.teacher ? props.teacher.lastName : ""}
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
                defaultValue={props.teacher ? props.teacher.idNumber : ""}
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
            </div>
            <div>
              <TextField
                id="email"
                label="Email"
                name="email"
                defaultValue={props.teacher ? props.teacher.email : ""}
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
                defaultValue={props.teacher ? props.teacher.phone : ""}
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
              {generateBrs(4)}
            </div>
          </GridDiv>

          <Button
            id="submitButton"
            style={{ backgroundColor: "#2fbd76", color: "white" }}
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
};

export default AddTeacher;

const generateBrs = (num: number): JSX.Element[] => {
  const arrOfSpaces = [];
  for (let i = 0; i < num; i++) {
    arrOfSpaces.push(<br />);
  }
  return arrOfSpaces;
};
