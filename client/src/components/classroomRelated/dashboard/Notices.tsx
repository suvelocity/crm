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
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import "../../../helpers/cancelScroll.css";
import { useRecoilValue } from "recoil";
import { classesOfTeacher } from "../../../atoms";
import { Wrapper, Center } from "../../../styles/styledComponents";

function Notices() {
  const classesToTeacher = useRecoilValue(classesOfTeacher);
  const [notices, setNotices] = useState<INotice[] | undefined>([]);
  const [selectedClass, setSelectedClass] = useState<number>(
    classesToTeacher[0] && classesToTeacher[0].classId
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
  const body = (
    <div style={modalStyle} className={classes.paper}>
      <AddNotice
        updateLocal={setNotices}
        closeModal={handleClose}
        classId={selectedClass}
      />
    </div>
  );

  useEffect(() => {
    (async () => {
      try {
        await setSelectedClass(classesToTeacher[0].classId);
      } catch (error) {}
    })();
  }, [classesToTeacher]);

  const getNotices = async () => {
    try {
      const { data }: { data: INotice[] } = await network.get(
        `/api/v1/notice/byclass/${selectedClass}`
      );
      setLoading(false);
      setNotices(data);
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
  };

  useEffect(() => {
    try {
      getNotices();
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
    //eslint-disable-next-line
  }, [selectedClass]);

  const deleteNotice = async (id: number) => {
    try {
      await network.delete(`/api/v1/notice/${id}`);
      setNotices((prev: INotice[] | undefined) =>
        prev?.filter((notice: INotice) => notice.id !== id)
      );

      Swal.fire("Notice deleted successfully!", "", "success");
    } catch (error) {
      //todo error handler
      Swal.fire("Error Occurred", error.message, "error");
    }
  };

  return (
    <Loading size={30} loading={loading}>
      {user.userType === "teacher" && classesToTeacher && (
        <FilterContainer>
          <FormControl>
            <InputLabel>Class</InputLabel>
            <Select
              style={{
                width: 250,
                // boxShadow: " 0 2px 3px rgba(0, 0, 0, 0.5)",
                // marginLeft: "5%",
                // marginTop: "auto",
                // marginBottom: "auto",
                // backgroundColor: "white",
              }}
              value={selectedClass}
              variant="outlined"
              color="primary"
              // defaultValue={classesToTeacher[0].classId}
              onChange={(e: any) => {
                setSelectedClass(e.target.value);
              }}
              label="Age"
            >
              {classesToTeacher?.map((teacherClass: any) => (
                <MenuItem value={teacherClass.classId}>
                  {teacherClass.Class.name}
                </MenuItem>
              ))}
              {/* <MenuItem value='cyber4s place holer'>cyber4s place holer</MenuItem>
            <MenuItem value='shit class'>shit class</MenuItem> */}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            onClick={handleOpen}
            style={{
              boxShadow: " 0 2px 3px rgba(0, 0, 0, 0.5)",
              marginLeft: "auto",
              marginRight: "5%",
              backgroundColor: "white",
              // marginTop: "auto",
              // marginBottom: "auto",
              // height: "100%",
            }}
          >
            Add Notice
          </Button>
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
      <NoticeContainer>
        {notices?.map((notice) => (
          //@ts-ignore
          <SingleNotice
            notice={notice}
            key={notice.id}
            deleteNotice={deleteNotice}
            userType={user.userType}
          />
        ))}
      </NoticeContainer>
    </Loading>
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
  /* background-color: ${({ theme }: { theme: any }) =>
    theme.colors.container};  */
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  /* margin-top: 5vh; */
`;

const NoticeContainer = styled.div`
  background-color: ${({ theme }: { theme: any }) => theme.colors.background};
  color: ${({ theme }: { theme: any }) => theme.colors.font};
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  max-height: 48vh;
  overflow-y: scroll;
  box-shadow: 5px 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
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
