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
import SingleNotice from "./SingleNotice";
import styled from "styled-components";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import "../../../helpers/cancelScroll.css";
import { Wrapper, Center } from "../../../styles/styledComponents";

function Notices() {
  const [notices, setNotices] = useState<INotice[] | undefined>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [classFilter, setClassFilter] = React.useState<string>("");
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
      <AddNotice updateLocal={setNotices} closeModal={handleClose} />
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
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
  }, []);

  useEffect(() => {
    try {
      getNotices();
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
    //eslint-disable-next-line
  }, []);

  const deleteNotice = async (id: number) => {
    try {
      await network.delete(`/api/v1/notice/${id}`);
      setNotices((prev: INotice[] | undefined) =>
        prev?.filter((notice: INotice) => notice.id !== id)
      );

      Swal.fire("Notice deleted successfully!", "", "success");
      console.log(`notice ${id} deleted sucssesfuly`);
    } catch (error) {
      //todo error handler
      Swal.fire("Error Occurred", error.message, "error");
    }
  };

  return (
    <>
      <Loading size={30} loading={loading}>
        <h1 style={{ marginLeft: "5%" }}>Notices</h1>
        {user.userType === "teacher" && (
          <FilterContainer>
            <Select
              style={{
                boxShadow: " 0 2px 3px rgba(0, 0, 0, 0.5)",
                marginLeft: "15px",
                marginTop: "auto",
                marginBottom: "auto",
                backgroundColor: "white",
              }}
              value={classFilter}
              variant='outlined'
              color='primary'
              onChange={(e: any) => {
                setClassFilter(e.target.value);
              }}>
              <MenuItem value='manual'>cyber4s place holer</MenuItem>
              <MenuItem value='challengeMe'>shit class</MenuItem>
            </Select>

            <Button
              variant='outlined'
              onClick={handleOpen}
              style={{
                boxShadow: " 0 2px 3px rgba(0, 0, 0, 0.5)",
                marginLeft: "auto",
                marginRight: "5%",
                backgroundColor: "white",
                // marginTop: "auto",
                // marginBottom: "auto",
                // height: "100%",
              }}>
              Add Notice
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby='simple-modal-title'
              aria-describedby='simple-modal-description'>
              {body}
            </Modal>
          </FilterContainer>
        )}
        <NoticeContainer>
          {/* <Wrapper> */}
          {notices?.map((notice) => (
            //@ts-ignore
            <SingleNotice
              notice={notice}
              key={notice.id}
              deleteNotice={deleteNotice}
              userType={user.userType}
            />
          ))}
          {/* </Wrapper> */}
        </NoticeContainer>
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
    noticeContainer: {
      position: "relative",
      minHeight: "35vh",
      padding: "3vw",
    },
  })
);

const FilterContainer = styled.div`
  display: flex;
  padding-bottom: 40px;
  padding-top: 40px;
  background-color: ${({ theme }: { theme: any }) => theme.colors.container};
  width: 90%;
  margin-left: auto;
  margin-right: auto;
`;

const NoticeContainer = styled.div`
  background-color: ${({ theme }: { theme: any }) => theme.colors.container};
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;
  margin-top: 40px;
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  max-height: 28vh;
  overflow-y: scroll;
  box-shadow: 5px 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;

  /* overflow: hidden; */
`;
// const Wrapper = styled.div`
//   margin: ${(props: { margin: string }) =>
//     props.margin ? props.margin : "5% auto"};
//   width: 80%;
//   padding: ${(props: { padding: string }) =>
//     props.padding ? props.padding : "40px"};
//   border-radius: 7px;
//   box-shadow: 5px 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
//   min-width: 300px;
//   max-width: ${(props: { width: string }) =>
//     props.width ? props.width : "700px"};
//   background-color: ${(props: { backgroundColor: string }) =>
//     props.backgroundColor ? props.backgroundColor : "white"};
//   color: ${(props: { color: string }) => (props.color ? props.color : "black")};
//   position: relative;
// `;
