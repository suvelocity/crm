import React, { useState, useMemo } from "react";
import { IMeeting } from "../../../typescript/interfaces";
import network from "../../../helpers/network";
import {
  Modal,
  Button,
  TextField,
  Tooltip,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
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

function SendMailModal({ id }: { id: number }) {
  const classes = useStyles();
  const modalStyle = getModalStyle();
  const [open, setOpen] = useState<boolean>(false);
  const [recievers, setRecievers] = useState<string>("");
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
      await network.post(`/api/V1/M/program/${id}`, data, {
        params: {
          recievers,
        },
      });
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className={classes.root}>
        <Center>
          <h1>Send Emails</h1>
        </Center>
        <form onSubmit={handleSubmit(submitStatus)}>
          <Center>
            <InputLabel>Recievers</InputLabel>
            <Select
              onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                setRecievers(e.target.value as string)
              }
            >
              <MenuItem value={""}>All</MenuItem>
              <MenuItem value="mentors">Mentors</MenuItem>
              <MenuItem value="students">Students</MenuItem>
            </Select>
                      <br />
                      <br />
            <TextField
              id="subject"
              inputRef={register({
                required: true,
              })}
              variant="outlined"
              name="subject"
              label="Subject"
            />
                      <br />
                      <br />
            <TextField
              id="content"
              inputRef={register({
                required: true,
              })}
              multiline
              fullWidth
              rows={4}
              variant="outlined"
              name="content"
              label="Content"
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
              SEND
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
              onClick={handleClose}
            >
              cancel
            </Button>
          </Center>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        Send Emails
      </Button>
      <Modal open={open} onClose={handleClose}>
        {body}
      </Modal>
    </>
  );
}

export default SendMailModal;

function getModalStyle() {
  return {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
}
