import React from "react";
import { Controller, useForm } from "react-hook-form";
import network from "../../helpers/network";
import { ErrorOutline as ErrorOutlineIcon } from "@material-ui/icons";
import {
  Wrapper,
  TitleWrapper,
  H1,
  Center,
  GridDiv,
  iconStyle,
  errorIconStyle,
} from "../../styles/styledComponents";
import { useHistory } from "react-router-dom";
import { IClass } from "../../typescript/interfaces";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Button,
  TextField,
  IconButton,
  Select,
  Tooltip,
} from "@material-ui/core";
import { ActionBtn, ErrorBtn } from "../formRelated";

const courses: string[] = ["Cyber4s", "Excellentteam", "Adva"];

const AddClass = () => {
  const { register, handleSubmit, errors, control } = useForm();
  const history = useHistory();

  const empty = Object.keys(errors).length === 0;

  const defaultDateValue = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`;

  const onSubmit = async (data: Omit<IClass, "id">) => {
    try {
      await network.post("/api/v1/class", data);
      history.push("/class/all");
    } catch (e) {
      alert("error occurred");
    }
  };

  return (
    <Wrapper>
      <Center>
        <TitleWrapper>
          <H1 color='#2c6e3c'>Add Class</H1>
        </TitleWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <GridDiv>
            <div>
              <FormControl
                style={{ minWidth: 200 }}
                error={Boolean(errors.course)}
              >
                <InputLabel>Please select a course</InputLabel>
                <Controller
                  as={
                    <Select>
                      {courses.map((course: string, i: number) => (
                        <MenuItem key={`opt${i}`} value={course}>
                          {course}
                        </MenuItem>
                      ))}
                    </Select>
                  }
                  name='course'
                  rules={{ required: "Course is required" }}
                  control={control}
                  defaultValue=''
                />
              </FormControl>
              {!empty ? (
                errors.course ? (
                  <Tooltip title={errors.course.message}>
                    <ErrorBtn />
                  </Tooltip>
                ) : (
                  <ActionBtn />
                )
              ) : null}
              {generateBrs(2)}

              <TextField
                id='name'
                label='Name'
                inputRef={register({
                  required: "Class title is required",
                  minLength: {
                    value: 2,
                    message: "Class needs to have a minimum of 2 letters",
                  },
                })}
                name='name'
              />
              {!empty ? (
                errors.name ? (
                  <Tooltip title={errors.name.message}>
                    <ErrorBtn />
                  </Tooltip>
                ) : (
                  <ActionBtn />
                )
              ) : null}
              {generateBrs(2)}

              <FormControl>
                <FormHelperText>Start Date</FormHelperText>
                <TextField
                  type='date'
                  id='startingDate'
                  name='startingDate'
                  inputRef={register({ required: "Start date is required" })}
                  defaultValue={defaultDateValue}
                  style={{ width: "12.7vw" }}
                />
              </FormControl>
              {!empty ? (
                errors.startDate ? (
                  <Tooltip title={errors.startDate.message}>
                    <ErrorBtn />
                  </Tooltip>
                ) : (
                  <ActionBtn />
                )
              ) : null}
              {generateBrs(2)}
            </div>
            <div>
              <TextField
                id='cycleNumber'
                name='cycleNumber'
                type='number'
                defaultValue={1}
                inputRef={register({
                  required: "Cycle number is required",
                })}
                label='Cycle Number'
              />
              {!empty ? (
                errors.cycleNumber ? (
                  <Tooltip title={errors.cycleNumber.message}>
                    <ErrorBtn />
                  </Tooltip>
                ) : (
                  <ActionBtn />
                )
              ) : null}
              {generateBrs(2)}

              <TextField
                name='zoomLink'
                inputRef={register({ required: "Zoom Link is required" })}
                label='Zoom Link'
              />
              {!empty ? (
                errors.zoomLink ? (
                  <Tooltip title={errors.zoomLink.message}>
                    <IconButton style={iconStyle}>
                      <ErrorOutlineIcon style={errorIconStyle} color='error' />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <ActionBtn />
                )
              ) : null}
              {generateBrs(2)}
              <FormControl>
                <FormHelperText>End Date</FormHelperText>
                <TextField
                  type='date'
                  id='endingDate'
                  name='endingDate'
                  inputRef={register({
                    required: "End date is required",
                  })}
                  defaultValue={`${new Date().getFullYear()}-${
                    new Date().getMonth() + 1
                  }-${new Date().getDate()}`}
                  style={{ width: "12.7vw" }}
                />
              </FormControl>
              {!empty ? (
                errors.endDate ? (
                  <Tooltip title={errors.endDate.message}>
                    <ErrorBtn />
                  </Tooltip>
                ) : (
                  <ActionBtn />
                )
              ) : null}
            </div>
          </GridDiv>
          {generateBrs(1)}
          <TextField
            id='additionalDetails'
            multiline
            fullWidth
            rows={5}
            variant='outlined'
            name='additionalDetails'
            inputRef={register({
              maxLength: {
                value: 500,
                message: "Additional Details are too long",
              },
            })}
            label='Additional Details'
          />
          {!empty ? (
            errors.additionalDetails ? (
              <Tooltip title={errors.additionalDetails.message}>
                <ErrorBtn />
              </Tooltip>
            ) : (
              <ActionBtn />
            )
          ) : null}
          {generateBrs(2)}
          <Button
            id='submitButton'
            style={{ backgroundColor: "#2c6e3c", color: "white" }}
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
};

export default AddClass;

const generateBrs = (num: number): JSX.Element[] => {
  const arrOfSpaces = [];
  for (let i = 0; i < num; i++) {
    arrOfSpaces.push(<br />);
  }
  return arrOfSpaces;
};
