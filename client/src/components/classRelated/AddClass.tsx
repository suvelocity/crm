import React from "react";
import { Controller, useForm } from "react-hook-form";
import network from "../../helpers/network";
import {
  Wrapper,
  TitleWrapper,
  H1,
  Center,
  GridDiv,
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
  Select,
} from "@material-ui/core";
import { ActionBtn, ErrorBtn } from "../formRelated";
import Swal from "sweetalert2";

const courses: string[] = ["Cyber4s", "Excellentteam", "Adva"];
interface Props {
  cls?: IClass;
  header?: string;
  update?: boolean;
  handleClose?: Function;
}
const AddClass = (props: Props) => {
  const { register, handleSubmit, errors, control } = useForm();
  const history = useHistory();

  const empty = Object.keys(errors).length === 0;

  const defaultDateValue = `${new Date().getFullYear()}-${(
    "0" +
    (new Date().getMonth() + 1)
  ).slice(-2)}-${("0" + new Date().getDate()).slice(-2)}`;

  const onSubmit = async (data: Omit<IClass, "id">) => {
    try {
      if (props.update && props.cls) {
        await network.patch(`/api/v1/class/${props.cls.id}`, data);
        props.handleClose && props.handleClose();
      } else {
        await network.post("/api/v1/class", data);
        history.push("/class/all");
      }
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
  };

  return (
    <Wrapper>
      <Center>
        <TitleWrapper>
          <H1 color="#2c6e3c">{props.header ? props.header : "Add Class"}</H1>
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
                  name="course"
                  rules={{ required: "Course is required" }}
                  control={control}
                  defaultValue={props.cls ? props.cls.course : ""}
                />
              </FormControl>
              {!empty ? (
                errors.course ? (
                  <ErrorBtn tooltipTitle={errors.course.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
              {generateBrs(2)}
              <TextField
                id="name"
                label="Name"
                defaultValue={props.cls ? props.cls.name : ""}
                inputRef={register({
                  required: "Class title is required",
                  minLength: {
                    value: 2,
                    message: "Class needs to have a minimum of 2 letters",
                  },
                })}
                name="name"
              />
              {!empty ? (
                errors.name ? (
                  <ErrorBtn tooltipTitle={errors.name.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
              {generateBrs(2)}

              <FormControl>
                <FormHelperText>Start Date</FormHelperText>
                <TextField
                  type="date"
                  id="startingDate"
                  name="startingDate"
                  defaultValue={
                    props.cls
                      ? props.cls.startingDate.slice(0, 10)
                      : defaultDateValue
                  }
                  inputRef={register({ required: "Start date is required" })}
                  style={{ width: "12.7vw" }}
                />
              </FormControl>
              {!empty ? (
                errors.startDate ? (
                  <ErrorBtn tooltipTitle={errors.startDate.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
              {generateBrs(2)}
            </div>
            <div>
              <TextField
                id="cycleNumber"
                name="cycleNumber"
                type="number"
                defaultValue={props.cls ? props.cls.cycleNumber : 1}
                inputRef={register({
                  required: "Cycle number is required",
                })}
                label="Cycle Number"
              />
              {!empty ? (
                errors.cycleNumber ? (
                  <ErrorBtn tooltipTitle={errors.cycleNumber.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
              {generateBrs(2)}

              <TextField
                name="zoomLink"
                inputRef={register({ required: "Zoom Link is required" })}
                label="Zoom Link"
                defaultValue={props.cls ? props.cls.zoomLink : ""}
              />
              {!empty ? (
                errors.zoomLink ? (
                  <ErrorBtn tooltipTitle={errors.company.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
              {generateBrs(2)}
              <FormControl>
                <FormHelperText>End Date</FormHelperText>
                <TextField
                  type="date"
                  id="endingDate"
                  name="endingDate"
                  defaultValue={
                    props.cls
                      ? props.cls.endingDate.slice(0, 10)
                      : defaultDateValue
                  }
                  inputRef={register({
                    required: "End date is required",
                  })}
                  style={{ width: "12.7vw" }}
                />
              </FormControl>
              {!empty ? (
                errors.endDate ? (
                  <ErrorBtn tooltipTitle={errors.endDate.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
            </div>
          </GridDiv>
          {generateBrs(1)}
          <TextField
            id="additionalDetails"
            multiline
            fullWidth
            defaultValue={props.cls ? props.cls.additionalDetails : ""}
            rows={5}
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
          {!empty ? (
            errors.additionalDetails ? (
              <ErrorBtn tooltipTitle={errors.additionalDetails.message} />
            ) : (
              <ActionBtn />
            )
          ) : null}
          {generateBrs(2)}
          <Button
            id="submitButton"
            style={{ backgroundColor: "#2c6e3c", color: "white" }}
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

export default AddClass;

const generateBrs = (num: number): JSX.Element[] => {
  const arrOfSpaces = [];
  for (let i = 0; i < num; i++) {
    arrOfSpaces.push(<br />);
  }
  return arrOfSpaces;
};
