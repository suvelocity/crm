import React, { useState, useMemo } from "react";
import network from "../../../helpers/network";
import { IMeeting } from "../../../typescript/interfaces";
import { Modal, Button, TextField } from "@material-ui/core";
import "date-fns";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { Center } from "../../../styles/styledComponents";
import Swal from "sweetalert2";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";

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

function EndMeetingModal({
  meeting,
  getMeetings,
}: {
  meeting: IMeeting;
  getMeetings: any;
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
      data.occurred = true;
      await network.put(`/api/V1/M/meeting/${meeting.id}`, data);
      getMeetings();
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className={classes.root}>
        <Center>
          <h1>End Meeting</h1>
        </Center>
        <form onSubmit={handleSubmit(submitStatus)}>
          <Center>
            <TextField
              id="title"
              inputRef={register({
                required: false,
              })}
              defaultValue={meeting.title}
              name="title"
              label="Change Meeting Title"
            />
            <br />
            <br />
            <TextField
              id="studentFeedback"
              multiline
              fullWidth
              rows={4}
              variant="outlined"
              name="studentFeedback"
              inputRef={register()}
              label="Student feedback - add your own feedback and conclusion here"
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
        <CheckCircleOutlineIcon />
      </Button>
      <Modal open={open} onClose={handleClose}>
        {body}
      </Modal>
    </>
  );
}

export default EndMeetingModal;

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
