import React, { useState } from "react";
import network from "../../helpers/network";
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
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { Controller, useForm } from "react-hook-form";
import { Center, GridDiv } from "../../styles/styledComponents";
import { IEvent } from "../../typescript/interfaces";
import { ActionBtn, ErrorBtn } from "../formRelated";
//TODO change this later
import { statuses } from "../../helpers";
import Swal from "sweetalert2";

function NewEventModal({
  studentId,
  jobId,
  add,
}: {
  studentId: number;
  jobId: number;
  add: (ne: IEvent) => void;
}) {
  const classes = useStyles();
  const modalStyle = getModalStyle();
  const [open, setOpen] = useState<boolean>(false);
  const { register, handleSubmit, errors, control } = useForm();

  const empty = Object.keys(errors).length === 0;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const submitStatus = async (e: React.FormEvent<HTMLFormElement>) => {
  const submitStatus = async (data: any) => {
    if (data.eventName === "Hired") {
      handleClose();
      const proceed: boolean = await promptAreYouSure();
      if (!proceed) return;
    }
    data.userId = studentId;
    data.relatedId = jobId;
    data.entry = { comment: data.comment };
    delete data.comment;
    try {
      const {
        data: newEvent,
      }: { data: IEvent; newEvent: IEvent } = await network.post(
        "/api/v1/event",
        data
      );
      add(newEvent);
      handleClose();
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
  };

  const promptAreYouSure: () => Promise<boolean> = async () => {
    return Swal.fire({
      title: "Are you sure?",
      text:
        "Changing status to 'hired' will automaticaly cancel all other applicants and the rest of this student jobs.\nThis is ireversible!",
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
          <h1>Add Event To Process</h1>
        </Center>
        <form onSubmit={handleSubmit(submitStatus)}>
          <GridDiv>
            <div>
              <FormControl
                style={{ minWidth: 200 }}
                error={Boolean(errors.course)}
              >
                <InputLabel>Please select a status</InputLabel>
                <Controller
                  as={
                    <Select>
                      {statuses.map((status: string) => (
                        <MenuItem key={`status-${status}`} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  }
                  name="eventName"
                  rules={{ required: "Event is required" }}
                  control={control}
                  defaultValue=""
                />
              </FormControl>
              {!empty ? (
                errors.eventName ? (
                  <ErrorBtn tooltipTitle={errors.eventName.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
              {generateBrs(2)}
              <FormHelperText>Date</FormHelperText>
              <TextField
                type="date"
                id="date"
                name="date"
                inputRef={register({ required: "Event date is required" })}
                defaultValue={`${new Date().getFullYear()}-${
                  new Date().getMonth() + 1
                }-${new Date().getDate()}`}
                style={{ width: "12.7vw" }}
              />{" "}
              {!empty ? (
                errors.date ? (
                  <ErrorBtn tooltipTitle={errors.date.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
            </div>
            <div>
              <br />
              <TextField
                multiline
                rows={4}
                id="comment"
                name="comment"
                label="Comment"
                variant="outlined"
                fullWidth
                inputRef={register({
                  maxLength: { value: 250, message: "Comment too long" },
                })}
              />
              {!empty ? (
                errors.comment ? (
                  <ErrorBtn tooltipTitle={errors.comment.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
            </div>
          </GridDiv>
          {generateBrs(2)}
          <Center>
            <Button
              type="submit"
              className={classes.button}
              variant="contained"
              color="primary"
            >
              Add
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
        style={{ display: "block", margin: "4vh auto" }}
        variant="contained"
        color="primary"
        onClick={handleOpen}
      >
        Change Process Status
      </Button>
      <Modal open={open} onClose={handleClose}>
        {body}
      </Modal>
    </>
  );
}

export default NewEventModal;

function getModalStyle() {
  return {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
}

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

const generateBrs = (num: number): JSX.Element[] => {
  const arrOfSpaces = [];
  for (let i = 0; i < num; i++) {
    arrOfSpaces.push(<br />);
  }
  return arrOfSpaces;
};
