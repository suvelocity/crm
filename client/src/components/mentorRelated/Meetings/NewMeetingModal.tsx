import React, { useState, useMemo } from "react";
import network from "../../../helpers/network";
import {
  Modal,
  Button,
  TextField,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import "date-fns";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { Center } from "../../../styles/styledComponents";
import Swal from "sweetalert2";
import DoneIcon from "@material-ui/icons/Done";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

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
    dateTimePicker: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  })
);

function NewMeetingModal({
  id,
  getMeetings,
  meetings,
}: {
  id: number;
  getMeetings: any;
  meetings: any;
}) {
  const classes = useStyles();
  const modalStyle = getModalStyle();
  const [open, setOpen] = useState<boolean>(false);
  const { register, handleSubmit, errors, control } = useForm();

  const empty = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submitStatus = async (data: any) => {
    handleClose();
    try {
      data.pairId = id;
      data.occurred = false;
      data.mentorEmail = meetings.Mentor.email;
      data.studentEmail = meetings.Student.email;
      data.mentorName = meetings.Mentor.name;
      data.studentName =
        meetings.Student.firstName + " " + meetings.Student.lastName;
      await network.post(`/api/v1/M/meeting`, data);
      getMeetings();
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className={classes.root}>
        <Center>
          <h1>New Meeting</h1>
        </Center>
        <form onSubmit={handleSubmit(submitStatus)}>
          <Center>
            <br />
            <br />
            <TextField
              id="datetime-local"
              name="date"
              label="Meeting Date And Time"
              type="datetime-local"
              className={classes.dateTimePicker}
              inputRef={register({
                required: "Date and Time is required",
              })}
              InputLabelProps={{
                shrink: true,
              }}
            />
            {!empty ? (
              errors.date ? (
                <Tooltip title={errors.date.message}>
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
              id="title"
              inputRef={register({
                required: false,
              })}
              name="title"
              label="Title - isn't required"
            />
            <br />
            <TextField
              id="location"
              inputRef={register({
                required: false,
              })}
              name="place"
              label="Location"
            />
            <br />
          </Center>
          <Center>
            <Button
              type="submit"
              className={classes.button}
              variant="contained"
              color="primary"
            >
              SAVE
            </Button>
          </Center>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <Button
        variant="contained"
        // color="primary"
        onClick={handleOpen}
      >
        Add Meeting
      </Button>
      <Modal open={open} onClose={handleClose}>
        {body}
      </Modal>
    </>
  );
}

export default NewMeetingModal;

function getModalStyle() {
  return {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
}
