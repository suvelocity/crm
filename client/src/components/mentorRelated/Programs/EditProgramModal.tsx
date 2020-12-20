import React, { useState, useCallback, useEffect } from "react";
import network from "../../../helpers/network";
import DateFnsUtils from "@date-io/date-fns";
import {
  Modal,
  Button,
  TextField,
} from "@material-ui/core";
import "date-fns";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { Controller, useForm } from "react-hook-form";
import { Center } from "../../../styles/styledComponents";
import { IMentorProgram } from "../../../typescript/interfaces";
import Swal from "sweetalert2";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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
  })
);

function EditProgramModal({ program, getPrograms }: { program: IMentorProgram, getPrograms:any }) {
  const classes = useStyles();
  const modalStyle = getModalStyle();
  const [open, setOpen] = useState<boolean>(false);
  const [programOpen, setProgramOpen] = useState<boolean>(program.open);
  const [startDate, setStartDate] = React.useState<Date | null>(new Date(program.startDate));
  const [endDate, setEndDate] = React.useState<Date | null>(new Date(program.endDate));
  const { register, handleSubmit, errors, control } = useForm();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submitStatus = async (data: any) => {
    handleClose();
    data.open = programOpen;
    data.startDate = startDate;
    data.endDate = endDate;
    !data.name? data.name=program.name:data.name=data.name;
    try {
        await network.put(`/api/V1/M/program/${program.id}`,data);
        getPrograms();
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
  };

  const promptAreYouSure: () => Promise<boolean> = async () => {
    return Swal.fire({
      title: "Are you sure?",
      text:
        "This Program will delete, and you would'nt watch it any more ",
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
  const deleteProgram = async ()=>{
      handleClose();
      const proceed: boolean = await promptAreYouSure();
      if (!proceed) return;
    await network.patch('/api/V1/M/program/delete',{programId:program.id});
    getPrograms()
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className={classes.root}>
        <Center>
          <h1>Edit Program Details</h1>
          <h3>{program.name}</h3>
        </Center>
        <form onSubmit={handleSubmit(submitStatus)}>
          <Center>
            <TextField
              id="name"
              name="name"
              inputRef={register({
                minLength: {
                  value: 2,
                  message: "Name needs to be a minimum of 2 letters",
                },
              })}
              label="Program Name"
              defaultValue={program.name}
            />
            <br />
            <br />
                  <Controller
                    as={
                        <FormControlLabel
                        control={
                          <Switch
                            onChange={()=>setProgramOpen(!programOpen)}
                            name="checkedB"
                            color="primary"
                          />
                        }
                        label={programOpen? "The program is open":"The program is close"}
                      />
                    }
                    name="open"
                    control={control}
                    />
                <br/>
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
              <br />
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
        <Center>
          <Button style={{textAlign: "center", margin: 10, backgroundColor:"#d50000"}} variant="contained" onClick={deleteProgram}>
            Delete Program
          </Button>
        </Center>
      </div>
    </div>
  );

  return (
    <>
        <EditIcon style={{cursor: "pointer"}} onClick={handleOpen}/>
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

