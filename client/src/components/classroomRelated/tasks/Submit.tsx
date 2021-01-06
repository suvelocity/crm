import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import network from "../../../helpers/network";
import TextField from "@material-ui/core/TextField";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";

export default function SubmitTask(props: any) {
  const { taskId, handleClose, handleSubmit } = props;
  const [url, setUrl] = useState("");

  //   const handleClose = () => {
  //     setOpen(false);
  //   };

  return (
    <div id='post-notice' style={{ display: "flex", flexDirection: "column" }}>
      <TextField
        onChange={(e) => {
          setUrl(e.target.value);
        }}
        id='outlined-multiline-static'
        label='url to submit'
        multiline
        rows={1}
        variant='outlined'
      />

      <Button
        variant='contained'
        color='primary'
        onClick={() => {
          handleSubmit(url);
        }}>
        Submit
      </Button>
    </div>
  );
}
