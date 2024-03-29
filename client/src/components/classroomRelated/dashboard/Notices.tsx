import React, { useState, useEffect, useCallback, useContext } from "react";
import { INotice } from "../../../typescript/interfaces";
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
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import "../../../helpers/cancelScroll.css";
import { useRecoilValue } from "recoil";
import { classesOfTeacher } from "../../../atoms";
import { StyledButton } from "../teacher/Teacher";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { Wrapper, Center } from "../../../styles/styledComponents";

function Notices() {
  const classesToTeacher = useRecoilValue(classesOfTeacher);
  const [notices, setNotices] = useState<INotice[]>([]);
  const [selectedClass, setSelectedClass] = useState<number>(
    classesToTeacher[0]?.classId
  );

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

  useEffect(() => {
    (async () => {
      try {
        await setSelectedClass(classesToTeacher[0].classId);
      } catch (error) {}
    })();
  }, [classesToTeacher]);

  const getNotices = async () => {
    try {
      const { data: notices }: { data: INotice[] } = await network.get(
        `/api/v1/notice/byclass/${selectedClass ? selectedClass : user.classId}`
      );
      return Array.isArray(notices) ? notices : [];
    } catch (error) {
      return [];
    }
  };

  const loadNotices = () => {
    (async () => {
      const notices = await getNotices();
      setNotices(notices);
      setLoading(false);
    })();
  };

  useEffect(() => {
    loadNotices();
  }, [selectedClass]);

  const deleteNotice = async (id: number) => {
    try {
      await network.delete(`/api/v1/notice/${id}`);
      setNotices((prev: INotice[]) =>
        prev?.filter((notice: INotice) => notice.id !== id)
      );

      Swal.fire("Notice deleted successfully!", "", "success");
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <AddNotice
        loadNotices={loadNotices}
        // updateLocal={setNotices}
        closeModal={handleClose}
        classId={selectedClass}
      />
    </div>
  );

  return (
    <Loading size={30} loading={loading}>
      {user.userType === "teacher" && selectedClass && (
        <FilterContainer>
          <FormControl color="primary" variant="outlined">
            {/* <InputLabel>Class</InputLabel> */}
            <Select
              id="class-select"
              variant="outlined"
              labelId="class-select-label"
              style={{
                width: 250,
                boxShadow: " 0 2px 3px rgba(0, 0, 0, 0.5)",
                marginTop: "auto",
                marginBottom: "auto",
                backgroundColor: "white",
              }}
              value={selectedClass}
              // defaultValue={selectedClass}
              onChange={(e: any) => {
                const newId = e.target.value;
                setSelectedClass(newId);
              }}
            >
              {classesToTeacher?.map((teacherClass: any, index: number) => (
                <MenuItem
                  key={"class_key" + index}
                  value={teacherClass.classId}
                >
                  {teacherClass.Class.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <StyledButton
            onClick={handleOpen}
            style={{ marginLeft: "auto", height: "auto" }}
          >
            New Notice
            <AddCircleIcon
              style={{ fontSize: "1.3em", marginLeft: "0.5vw" }}
            />{" "}
          </StyledButton>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            {body}
          </Modal>
        </FilterContainer>
      )}
      <hr
        style={{
          width: "80%",
          opacity: "50%",
          margin: 0,
          marginLeft: "auto",
          marginRight: "auto",
          boxShadow: "1px",
        }}
      />
      <NoticeContainer>
        {notices.length ? (
          notices.map((notice, index) => (
            //@ts-ignore
            <SingleNotice
              notice={notice}
              key={"notice_key" + index}
              deleteNotice={deleteNotice}
              userType={user.userType}
            />
          ))
        ) : (
          <div>no notices found</div>
        )}
      </NoticeContainer>
    </Loading>
  );
}

export default Notices;

function getModalStyle() {
  return {
    top: `${50}%`,
    left: `${50}%`,
    transform: `translate(-${50}%, -${50}%)`,
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
  /* background-color: ${({ theme }: { theme: any }) =>
    theme.colors.container}; */
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  /* margin-top: 5vh; */
`;

const NoticeContainer = styled.div`
  /* background-color: ${({ theme }: { theme: any }) =>
    theme.colors.container}; */
  /* color: ${({ theme }: { theme: any }) => theme.colors.font}; */
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2%;
  max-height: 74vh;
  height: fit-content;
  overflow-y: scroll;
  /* box-shadow: 5px 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset; */
  /* overflow: hidden; */
`;
// const NoticeBoard = styled.div`
//   background-color: ${({ theme }: { theme: any }) => theme.colors.container};
//   color: ${({ theme }: { theme: any }) => theme.colors.font};
//   display: flex;
//   flex-direction: column;
//   padding-bottom: 40px;
//   width: 50%;
//   margin-left: auto;
//   margin-right: auto;
//   max-height: 35vh;
//   overflow-y: scroll;
//   box-shadow: 5px 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
//   /* overflow: hidden; */
// `;
