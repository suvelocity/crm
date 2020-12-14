import React, { useState, useEffect, useCallback, useContext } from "react";
import { INotice } from "../../../typescript/interfaces"; //todo add interface
import { Loading } from "react-loading-wrapper";
import Swal from "sweetalert2";
import network from "../../../helpers/network";
import Modal from "@material-ui/core/Modal";
import AddNotice from "./AddNotice";
import Button from "@material-ui/core/Button";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { AuthContext } from "../../../helpers";

function Notices() {
  const [notices, setNotices] = useState<INotice[] | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  //@ts-ignore
  const { user } = useContext(AuthContext);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const body = (
    <div style={modalStyle} className={classes.paper}>
      <AddNotice />
    </div>
  );
  const classIdPlaceHolder = 1;

  const getNotices = useCallback(async () => {
    try {
      const { data }: { data: INotice[] } = await network.get(
        `/api/v1/notice/byclass/${classIdPlaceHolder}`
      );
      setLoading(false);
      setNotices(data);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      getNotices();
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
    //eslint-disable-next-line
  }, []);
  return (
    <>
      <Loading size={30} loading={loading}>
        <div
          className='notice-container'
          style={{ backgroundColor: "white" }}
        ></div>

        {user.userType === "teacher" && (
          <div>
            <Button variant='outlined' onClick={handleOpen}>
              Add Notice
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby='simple-modal-title'
              aria-describedby='simple-modal-description'
            >
              {body}
            </Modal>
          </div>
        )}
      </Loading>
    </>
  );
}

export default Notices;

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);
