import React from "react";
import { INotice } from "../../../typescript/interfaces";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Alert, AlertTitle } from "@material-ui/lab";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";

export default function SingleNotice(props: any) {
  const { notice, deleteNotice, userType } = props;
  const [open, setOpen] = React.useState(true);
  console.log(notice);

  return (
    <div
      className={"single-notice-container"}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
        padding: "20px",
        // backgroundColor: "#2C3034",
        font: "25px",
      }}>
      <Collapse in={open}>
        <Alert
          style={{ display: "flex" }}
          severity={notice.type == "regular" ? "info" : "error"}
          action={
            <IconButton
              aria-label='close'
              color='inherit'
              size='small'
              onClick={() => {
                setOpen(false);
              }}>
              <CloseIcon fontSize='inherit' />
            </IconButton>
          }>
          <AlertTitle>
            <b>
              <u>
                {notice.Teacher?.firstName + " " + notice.Teacher?.lastName}
              </u>
            </b>
          </AlertTitle>
          <strong> {notice.body}</strong>

          {userType === "teacher" && (
            <div className='single-notice-buttons' style={{}}>
              <Button
                variant='outlined'
                style={{ marginTop: "10px", alignSelf: "flex-end" }}
                onClick={() => {
                  deleteNotice(notice.id);
                }}>
                delete for students
              </Button>
            </div>
          )}
        </Alert>
      </Collapse>
      {!open && (
        <Button
          color='primary'
          onClick={() => {
            setOpen(true);
          }}>
          Re-open
        </Button>
      )}
    </div>
  );
}
