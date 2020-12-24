import React from "react";
import { INotice } from "../../../typescript/interfaces";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Alert, AlertTitle } from "@material-ui/lab";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import { stubString } from "lodash";
import { formatToIsraeliDate } from "../../../helpers/general";

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
        width: "100%",
        marginTop: "2%",
        // padding: "20px",
        // backgroundColor: "#2C3034",
        font: "25px",
        boxShadow: " 0 10px 10px rgba(0, 0, 0, 0.055)",
      }}>
      <Collapse in={open}>
        <Alert
          style={{ display: "flex" }}
          severity={notice.type == "regular" ? "info" : "error"}
          action={
            <IconButton
              aria-label='hide'
              color='inherit'
              size='small'
              onClick={() => {
                setOpen(false);
              }}>
              {/* <CloseIcon fontSize='inherit' /> */}
              <p style={{ fontSize: "14px" }}>
                <u>Hide</u>
              </p>
            </IconButton>
          }>
          <AlertTitle>
            <b>
              <u>
                {notice.Teacher?.firstName + " " + notice.Teacher?.lastName}
              </u>
            </b>
            <p>
              {formatToIsraeliDate(notice.createdAt) +
                " " +
                notice.createdAt.substring(11, 16)}
            </p>
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
