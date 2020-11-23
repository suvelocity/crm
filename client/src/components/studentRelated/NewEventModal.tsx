import React, { useState, useEffect } from "react";
import network from "../../helpers/network";
import { Modal, Button, TextField } from "@material-ui/core";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";

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

function NewEventModal({
  studentId,
  jobId,
  getStudent,
}: {
  studentId: number;
  jobId: number;
  getStudent: () => void;
}) {
  const classes = useStyles();
  const modalStyle = getModalStyle();
  const [open, setOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<string>();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await network.post(`/api/v1/event`, {
        studentId,
        jobId,
        status,
      });
      getStudent();
      handleClose();
    } catch (e) {
      console.log(e);
    }
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className={classes.root}>
        <h1>Add Event To Process</h1>
        <form onSubmit={handleSubmit}>
          <TextField
            required={true}
            label="Enter New Status"
            onChange={(e: {
              target: { value: React.SetStateAction<string | undefined> };
            }) => setStatus(e.target.value)}
          />
          <br />
          <Button
            type="submit"
            className={classes.button}
            variant="contained"
            color="primary"
          >
            Add
          </Button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <Button
        style={{ height: 32, position: "absolute", right: 10, bottom: 10 }}
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
