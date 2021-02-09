import React, { useState, useMemo } from "react";
import { IMeeting } from "../../../typescript/interfaces";
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
import EditIcon from "@material-ui/icons/Edit";

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

function EditMeetingModal({
  meeting,
  getMeetings,
}: {
  meeting: IMeeting;
  getMeetings: any;
}) {
  const classes = useStyles();
  const modalStyle = getModalStyle();
  const [open, setOpen] = useState<boolean>(false);
  const { register, handleSubmit, errors } = useForm();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submitStatus = async (data: any) => {
    handleClose();
    try {
      !data.date ? (data.date = meeting.date) : (data.date = data.date);
      await network.put(`/api/v1/M/meeting/${meeting.id}`, data);
      getMeetings();
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
  };

  const deleteMeeting = async () => {
    handleClose();
    const proceed: boolean = await promptAreYouSure();
    if (!proceed) return;
    await network.patch(`/api/v1/M/meeting/delete`, {meetingtId:meeting.id});
    getMeetings();
  };

  const promptAreYouSure: () => Promise<boolean> = async () => {
    return Swal.fire({
      title: "Are you sure?",
      text:
        "This Appointment will delete, and you would'nt watch it any more ",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#2fa324",
      confirmButtonText: "Delete!",
    }).then((result) => {
      if (result.isConfirmed) return true;
      return false;
    });
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className={classes.root}>
        <Center>
          <h1>Edit Meeting</h1>
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
              defaultValue={new Date(meeting.date)}
              className={classes.dateTimePicker}
              inputRef={register({
                required: false,
              })}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <br />
            <br />
            <TextField
              id="title"
              inputRef={register({
                required: false,
              })}
              defaultValue={meeting.title}
              name="title"
              label="Title - isn't required"
            />
            <br />
            <TextField
              id="location"
              inputRef={register({
                required: false,
              })}
              defaultValue={meeting.place}
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
            <br />
            <br />
            <Button
              style={{
                textAlign: "center",
                margin: 10,
                backgroundColor: "#d50000",
              }}
              variant="contained"
              onClick={deleteMeeting}
            >
              Delete Meeting
            </Button>
          </Center>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        <EditIcon />
      </Button>
      <Modal open={open} onClose={handleClose}>
        {body}
      </Modal>
    </>
  );
}

export default EditMeetingModal;

function getModalStyle() {
  return {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
}
