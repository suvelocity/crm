import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import network from "../../helpers/network";
import {
  validEmailRegex,
  validNameRegex,
  validPhoneNumberRegex,
  onlyNumbersRegex,
} from "../../helpers";
import DoneIcon from "@material-ui/icons/Done";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
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
      } catch (error) {
        Swal.fire("Error Occurred", error.message, "error");
      }
    })();
  }, [setClasses]);

  const empty = Object.keys(errors).length === 0;

  const onSubmit = async (data: IStudent) => {
    try {
      await network.post("/api/v1/student", data);
      history.push("/student/all");
    } catch (error) {
      if (error.response.status === 409) {
        Swal.fire({
          title: "User with the same id already exists",
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
          <H1>Add Student</H1>
        </TitleWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <GridDiv>
            <div>
              <TextField
                id='firstName'
                name='firstName'
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
                label='First Name'
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
                id='lastName'
                name='lastName'
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
                label='Last Name'
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
                id='idNumber'
                name='idNumber'
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
                label='ID Number'
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
                id='email'
                label='Email'
                name='email'
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
                id='phone'
                name='phone'
                inputRef={register({
                  required: "Phone is required",
                  pattern: {
                    value: validPhoneNumberRegex,
                    message: "Invalid phone number",
                  },
                })}
                label='Phone Number'
              />
              {!empty ? (
                errors.phone ? (
                  <ErrorBtn tooltipTitle={errors.phone.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
              <br />
              <TextField
                id='languages'
                name='languages'
                inputRef={register({
                  required: "Languages is required",
                })}
                label='Languages'
              />
              {!empty ? (
                errors.languages ? (
                  <ErrorBtn tooltipTitle={errors.languages.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
              {generateBrs(2)}
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
                  name='classId'
                  rules={{ required: "Class is required" }}
                  control={control}
                  defaultValue=''
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
                id='address'
                name='address'
                inputRef={register({ required: "Address is required" })}
                label='Address'
              />
              <TextField
                id='age'
                name='age'
                inputRef={register({
                  required: "Age is required",
                  pattern: {
                    value: onlyNumbersRegex,
                    message: "Age needs to be a number",
                  },
                })}
                label='Age'
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
                id='maritalStatus'
                name='maritalStatus'
                inputRef={register({ required: "Marital status is required" })}
                label='Marital Status'
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
                id='children'
                name='children'
                type='number'
                label='Number of children'
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
                  <ErrorBtn tooltipTitle={errors.children.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
              <br />
              <TextField
                id='citizenship'
                name='citizenship'
                inputRef={register({
                  required: "Citizenship is required",
                })}
                label='Citizenship'
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
            id='militaryService'
            multiline
            fullWidth
            rows={4}
            variant='outlined'
            name='militaryService'
            inputRef={register()}
            label='Military Service'
          />
          {generateBrs(2)}

          <TextField
            id='workExperience'
            multiline
            fullWidth
            rows={4}
            variant='outlined'
            name='workExperience'
            inputRef={register()}
            label='Work Experience'
          />
          {generateBrs(2)}

          <TextField
            id='academicBackground'
            multiline
            fullWidth
            rows={4}
            variant='outlined'
            name='academicBackground'
            inputRef={register()}
            label='Academic Background'
          />
          {generateBrs(2)}
          <TextField
            id='additionalDetails'
            multiline
            fullWidth
            rows={4}
            variant='outlined'
            name='additionalDetails'
            inputRef={register()}
            label='Additional Details'
          />
          {generateBrs(2)}
          <Button
            id='submitButton'
            variant='contained'
            color='primary'
            type='submit'
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
