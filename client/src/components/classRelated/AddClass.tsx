import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import network from "../../helpers/network";
import DoneIcon from "@material-ui/icons/Done";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import TextField from "@material-ui/core/TextField";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import {
  Wrapper,
  TitleWrapper,
  H1,
  Center,
  GridDiv,
} from "../../styles/styledComponents";
import { useHistory } from "react-router-dom";
import { IJob } from "../../typescript-utils/interfaces";
import { validNameRegex, validAdressRegex } from "../../helpers/patterns";
import { FormControl, FormHelperText } from "@material-ui/core";

const AddClass = () => {
  const { register, handleSubmit, errors, watch } = useForm();
  const history = useHistory();

  const empty = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const onSubmit = async (data: Omit<IJob, "id">) => {
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
          <H1 color="#2c6e3c">Add Class</H1>
        </TitleWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <GridDiv>
            <div>
              <TextField
                id="course"
                label="Course"
                name="course"
                inputRef={register({
                  required: "Company is required",
                  pattern: {
                    value: validNameRegex,
                    message: "Company name can have only letters and spaces",
                  },
                  minLength: {
                    value: 3,
                    message: "First name needs to have a minimum of 3 letters",
                  },
                })}
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
              <TextField
                id="name"
                label="Name"
                inputRef={register({
                  required: "Position title is required",
                  pattern: {
                    value: validNameRegex,
                    message: "Position can have only letters and spaces",
                  },
                  minLength: {
                    value: 6,
                    message: "Position needs to have a minimum of 3 letters",
                  },
                })}
                name="name"
              />
              {!empty ? (
                errors.name ? (
                  <Tooltip title={errors.name.message}>
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
              <FormControl>
                <FormHelperText>Start Date</FormHelperText>
                <TextField
                  type="date"
                  id="startingDate"
                  name="startingDate"
                  inputRef={register({ required: "Start date is required" })}
                  style={{ width: "12.7vw" }}
                />
              </FormControl>
              {!empty ? (
                errors.startDate ? (
                  <Tooltip title={errors.startDate.message}>
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
            </div>
            <div>
              <TextField
                id="cycleNumber"
                name="cycleNumber"
                type="number"
                defaultValue={1}
                inputRef={register({
                  required: "Cycle number is required",
                })}
                label="Cycle Number"
              />
              {!empty ? (
                errors.cycleNumber ? (
                  <Tooltip title={errors.cycleNumber.message}>
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
                name="zoomLink"
                inputRef={register({ required: "Zoom Link is required" })}
                label="Zoom Link"
              />
              {!empty ? (
                errors.zoomLink ? (
                  <Tooltip title={errors.zoomLink.message}>
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
              <FormControl>
                <FormHelperText>End Date</FormHelperText>
                <TextField
                  type="date"
                  id="endingDate"
                  name="endingDate"
                  inputRef={register({
                    required: "End date is required",
                  })}
                  style={{ width: "12.7vw" }}
                />
              </FormControl>
              {!empty ? (
                errors.endDate ? (
                  <Tooltip title={errors.endDate.message}>
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
            </div>
          </GridDiv>

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
