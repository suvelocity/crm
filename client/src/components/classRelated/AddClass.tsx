import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import network from "../../helpers/network";
import DoneIcon from "@material-ui/icons/Done";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import TextField from "@material-ui/core/TextField";
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
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";

const AddClass = () => {
  const { register, handleSubmit, errors, control } = useForm();
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
              <FormControl
                style={{ minWidth: 200 }}
                error={Boolean(errors.course)}
              >
                <InputLabel>Please select a course</InputLabel>
                <Controller
                  as={
                    <Select>
                      <MenuItem key="opt1" value="Cyber4s">
                        Cyber4s
                      </MenuItem>
                      <MenuItem key="opt2" value="Test">
                        Test
                      </MenuItem>
                    </Select>
                  }
                  name="course"
                  rules={{ required: "Course is required" }}
                  control={control}
                  defaultValue=""
                />
              </FormControl>
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
                  required: "Class title is required",
                  pattern: {
                    value: validNameRegex,
                    message: "Class can have only letters and spaces",
                  },
                  minLength: {
                    value: 2,
                    message: "Class needs to have a minimum of 2 letters",
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
                  defaultValue={`${new Date().getFullYear()}-${
                    new Date().getMonth() + 1
                  }-${new Date().getDate()}`}
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
                  defaultValue={`${new Date().getFullYear()}-${
                    new Date().getMonth() + 1
                  }-${new Date().getDate()}`}
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
          <br />

          <TextField
            id="additionalDetails"
            multiline
            fullWidth
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
              <Tooltip title={errors.additionalDetails.message}>
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
