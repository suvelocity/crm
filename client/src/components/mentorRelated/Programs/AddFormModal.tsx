import React, { useState } from "react";
import network from "../../../helpers/network";
import { Modal, Button, TextField } from "@material-ui/core";
import "date-fns";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { Center } from "../../../styles/styledComponents";
import Swal from "sweetalert2";
import { ActionBtn, ErrorBtn } from "../../formRelated";

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

function AddFormModal({getForms, id}:{getForms:any, id:number}) {
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

  const submitStatus = async (data: any) => {
    handleClose();
    data.programId = id;
    try {
      console.log(data);
      await network.post(`/api/V1/M/form/`, data);
      getForms()
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
  };


  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className={classes.root}>
        <Center>
          <h1>Add Form To The Program</h1>
        </Center>
        <form onSubmit={handleSubmit(submitStatus)}>
          <Center>
            <TextField
              id="title"
              name="title"
              inputRef={register({
                required: "Form Title is required",
                minLength: {
                  value: 2,
                  message: "Title needs to be a minimum of 2 letters",
                },
              })}
              label="Form Title"
            />
              {!empty ? (
                errors.title ? (
                  <ErrorBtn tooltipTitle={errors.title.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
            <br/>
            <br/>
            <TextField
              id="URL"
              name="url"
              multiline
              fullWidth
              rows={1}
              variant="outlined"
              inputRef={register({
                required: "URL is required",
              })}
              label="Edit Form URL"
            />
            <br />
            <br />
            <TextField
              id="answerUrl"
              name="answerUrl"
              multiline
              fullWidth
              rows={1}
              variant="outlined"
              inputRef={register({
                required: "Answer URL is required",
              })}
              label="Answer Form URL"
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
      <a style={{color:"black", textDecoration: "none"}} href="https://docs.google.com/forms" target="_blank">
        <Button style={{ backgroundColor: "#fa8c84", margin: 5 }} onClick={handleOpen}>
          Add Form
        </Button>
      </a>
      <Modal open={open} onClose={handleClose}>
        {body}
      </Modal>
    </>
  );
}

export default AddFormModal;

function getModalStyle() {
  return {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
}
