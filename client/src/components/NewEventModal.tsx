import React, { useState, useEffect, useMemo } from "react";
import network from "../helpers/network";
import {
  Modal,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Tooltip,
  IconButton,
  Select,
  MenuItem,
  FormHelperText,
} from "@material-ui/core";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { Controller, useForm } from "react-hook-form";
import { ErrorOutlineOutlined } from "@material-ui/icons";
import DoneIcon from "@material-ui/icons/Done";
import { Center, GridDiv } from "../styles/styledComponents";
import { IEvent } from "../typescript/interfaces";

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

// change this later TODO
const statuses: string[] = [
  "Sent CV",
  "First interview",
  "Second interview",
  "Hired",
  "Rejected",
];

function NewEventModal({
  studentId,
  jobId,
  get,
}: {
  studentId: number;
  jobId: number;
  get: () => void;
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

  // const submitStatus = async (e: React.FormEvent<HTMLFormElement>) => {
  const submitStatus = async (data: any) => {
    data.studentId = studentId;
    data.jobId = jobId;
    console.log(data);
    try {
      await network.post(`/api/v1/event`, data);
      get();
      handleClose();
    } catch (e) {
      console.log(e);
    }
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
                  name="status"
                  rules={{ required: "Event is required" }}
                  control={control}
                  defaultValue=""
                />
              </FormControl>
              {!empty ? (
                errors.status ? (
                  <Tooltip title={errors.status.message}>
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineOutlined
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
                  <Tooltip title={errors.date.message}>
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineOutlined
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
                inputRef={register({ maxLength: 50 })}
              />
              {!empty ? (
                errors.comment ? (
                  <Tooltip title={errors.comment.message}>
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineOutlined
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
          <br />
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
