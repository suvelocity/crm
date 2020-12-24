import React, { useState, useMemo, useEffect, useCallback } from "react";
import network from "../../helpers/network";
import "date-fns";
import {
  H1,
  Wrapper,
  TitleWrapper,
  StyledLink,
  Center,
  StyledSpan,
  StyledUl,
  StyledDiv,
  TableHeader,
  GridDiv,
} from "../../styles/styledComponents";
import { IClass, IMentorProgram } from "../../typescript/interfaces";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { useForm, Controller } from "react-hook-form";
import { validCompanyRegex } from "../../helpers/patterns";
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
import { useHistory } from "react-router-dom";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const NewProgram: React.FC = () => {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const { register, handleSubmit, errors, control } = useForm();
  const history = useHistory();

  const empty = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const onSubmit = async (data: IMentorProgram) => {
    try {
      data.open = true;
      data.startDate = startDate!.toString();
      data.endDate = endDate!.toString();
      console.log(data);
      const res = await network.post("/api/v1/M/program/", data);
      console.log(res);
      
      history.push(`/mentor/new/${res.data.id}?class=${data.classId}`);
    } catch (e) {
      alert("error occurred");
    }
  };

  const getClasses = useCallback(async () => {
    const { data } = await network.get("/api/v1/M/classes");
    setClasses(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    getClasses();
  }, []);

  return (
    <Wrapper>
      <Center>
        <TitleWrapper>
          <H1 color={"#c47dfa"}>Create New Mentor Program</H1>
        </TitleWrapper>
        <Loading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <GridDiv>
              <div>
                <TextField
                  id="name"
                  name="name"
                  inputRef={register({
                    required: "Program Name is required",
                    minLength: {
                      value: 2,
                      message: "Full Name needs to be a minimum of 2 letters",
                    },
                  })}
                  label="Program Name"
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
                <FormControl
                  style={{ minWidth: 200 }}
                  error={Boolean(errors.classId)}
                >
                  <InputLabel>Class</InputLabel>
                  <Controller
                    as={
                      <Select>
                        {classes &&
                          classes[0] &&
                          classes.map((cls, i) => {
                            return (
                              <MenuItem
                                key={i}
                                value={cls.id}
                              >{`${cls.name}-${cls.cycleNumber}`}</MenuItem>
                            );
                          })}
                      </Select>
                    }
                    name="classId"
                    rules={{ required: "Class is required" }}
                    control={control}
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
              </div>
              <div>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="startDate"
                    label="Start Date"
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                    name="startDate"
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="endDate"
                    label="End Date"
                    value={endDate}
                    onChange={(date) => setEndDate(date)}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </div>
            </GridDiv>
            <br />
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
        </Loading>
      </Center>
    </Wrapper>
  );
};

export default NewProgram;
