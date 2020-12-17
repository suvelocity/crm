import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import network from "../../../helpers/network";
import TextField from "@material-ui/core/TextField";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";

export default function SubmitTask(props: any) {
  const { taskId, handleClose } = props;
  const [url, setUrl] = useState("");

  //   const handleClose = () => {
  //     setOpen(false);
  //   };

  const submitTask = async () => {
    try {
      const { data } = await network.put(`/api/v1/task/submit/${taskId}`, {
        url: url,
      });
      handleClose();
      if (data.error) {
        Swal.fire("Error Occurred", data.error, "error");
      }
    } catch (error) {
      handleClose();
      Swal.fire("Error Occurred", error.message, "error");
    }
  };

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

      <Button variant='contained' color='secondary' onClick={submitTask}>
        Submit
      </Button>
    </div>
  );
}
