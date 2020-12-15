import React, { useState, useCallback, useEffect } from "react";
import network from "../../helpers/network";
import DateFnsUtils from "@date-io/date-fns";
import {
  Modal,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Tooltip,
  Select,
  MenuItem,
  FormHelperText,
} from "@material-ui/core";
import "date-fns";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { Controller, useForm } from "react-hook-form";
import { Center, GridDiv } from "../../styles/styledComponents";
import { IEvent, IClass, IMentorProgram } from "../../typescript/interfaces";
import { ActionBtn, ErrorBtn } from "../formRelated";
//TODO change this later
import { statuses } from "../../helpers";
import Swal from "sweetalert2";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    paper: {
      position: "absolute",
      width: "50%",
      maxWidth: 700,
      minWidth: 300,
      backgroundColor: theme.palette.background.paper,
      borderRadius: 7,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      outline: "none",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: "33.33%",
      flexShrink: 0,
      fontWeight: theme.typography.fontWeightBold,
      marginTop: 11,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
      marginTop: 11,
    },
    button: {
      textAlign: "center",
      margin: 10,
    },
  })
);

function EditProgramModal({ programId }: { programId: number }) {
  const classes = useStyles();
  const modalStyle = getModalStyle();
  const [open, setOpen] = useState<boolean>(false);
  const [cls, setCls] = useState<IClass[]>();
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const { register, handleSubmit, errors, control } = useForm();

  const getClasses = useCallback(async () => {
    const { data } = await network.get("/api/v1/M/classes");
    setCls(data);
  }, [setCls]);

  useEffect(() => {
    getClasses();
  }, []);

  const empty = Object.keys(errors).length === 0;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //   const submitStatus = async (e: React.FormEvent<HTMLFormElement>) => {
  const submitStatus = async (data: any) => {
    // if (data.eventName === "Hired") {
    handleClose();
    //   const proceed: boolean = await promptAreYouSure();
    //   if (!proceed) return;
    // }
    // data.userId = studentId;
    // data.relatedId = jobId;
    // data.entry = { comment: data.comment };
    // delete data.comment;
    // console.log(data);
    try {
      //   const {
      //     data: newEvent,
      //   }: { data: IEvent; newEvent: IEvent } = await network.post(
      //     "/api/v1/event",
      //     data
      //   );
      //   add(newEvent);
      //   handleClose();
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
  };

  const promptAreYouSure: () => Promise<boolean> = async () => {
    return Swal.fire({
      title: "Are you sure?",
      text:
        "Changing status to 'hired' will automatically cancel all other applicants and the rest of this student jobs.\nThis is irreversible!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#2fa324",
      confirmButtonText: "Hire!",
    }).then((result) => {
      if (result.isConfirmed) return true;
      return false;
    });
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className={classes.root}>
        <Center>
          <h1>Edit Program Details</h1>
        </Center>
        <form onSubmit={handleSubmit(submitStatus)}>
          <GridDiv>
            <FormControl
              style={{ minWidth: 200 }}
              error={Boolean(errors.classId)}
            >
              <InputLabel>Class</InputLabel>
              <Controller
                as={
                  <Select>
                    {cls &&
                      cls[0] &&
                      cls.map((c, i) => {
                        return (
                          <MenuItem
                            key={i}
                            value={c.id}
                          >{`${c.name}-${c.cycleNumber}`}</MenuItem>
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
                <ErrorBtn tooltipTitle={errors.classId.message} />
              ) : (
                <ActionBtn />
              )
            ) : null}
            <br />
            <TextField
              id="name"
              name="name"
              inputRef={register({
                required: "Program Name is required",
                minLength: {
                  value: 2,
                  message: "Name needs to be a minimum of 2 letters",
                },
              })}
              label="Program Name"
            />{" "}
            {!empty ? (
              errors.name ? (
                <ErrorBtn tooltipTitle={errors.name.message} />
              ) : (
                <ActionBtn />
              )
            ) : null}
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
          <Center>
            <Button
              type="submit"
              className={classes.button}
              variant="contained"
              color="primary"
            >
              Edit
            </Button>
          </Center>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <Button
        // style={{ height: 32, position: "absolute", right: 10, bottom: 10 }}
        style={{position: "relative" }}
        // style={{ display: "block", margin: "4vh auto" }}
        variant="contained"
        color="primary"
        onClick={handleOpen}
      >
        Edit Program
      </Button>
      <Modal open={open} onClose={handleClose}>
        {body}
      </Modal>
    </>
  );
}

export default EditProgramModal;

function getModalStyle() {
  return {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
}

// const generateBrs = (num: number): JSX.Element[] => {
//   const arrOfSpaces = [];
//   for (let i = 0; i < num; i++) {
//     arrOfSpaces.push(<br />);
//   }
//   return arrOfSpaces;
// };
