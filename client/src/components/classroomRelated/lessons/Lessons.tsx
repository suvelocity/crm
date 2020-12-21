import React, { useState, useEffect, useContext } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Loading } from "react-loading-wrapper";
import AddLesson from "./AddLesson";
import network from "../../../helpers/network";
import { AuthContext } from "../../../helpers";
import styled from "styled-components";
import { ILesson } from "../../../typescript/interfaces";
import Lesson from "./Lesson";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { classesOfTeacher } from "../../../atoms";
import { useRecoilValue } from "recoil";

export default function Lessons() {
  const [loading, setLoading] = useState<boolean>(true);
  const classesToTeacher = useRecoilValue(classesOfTeacher);

  const classes = useStyles();
  // const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState<boolean>(false);
  const [lessons, setLessons] = React.useState<ILesson[]>([]);
  const [filteredLessons, setFilteredLessons] = React.useState<ILesson[]>([]);
  const [filter, setFilter] = React.useState<string>("");
  const [selectedClass, setSelectedClass] = React.useState<number>(
    classesToTeacher[0] && classesToTeacher[0].classId
  );

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilter(value);
    setFilteredLessons(() =>
      lessons.filter((lesson: ILesson) => {
        for (let item of Object.values(lesson)) {
          if (item) {
            if (item.toString().toLowerCase().includes(value.toLowerCase())) {
              return true;
            }
          }
        }
      })
    );
  };

  //@ts-ignore
  const { user } = useContext(AuthContext);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    //@ts-ignore
    <div style={modalStyle} className={classes.paper}>
      <AddLesson setOpen={setOpen} classId={selectedClass} />
    </div>
  );

  const fetchClassLessons = async () => {
    try {
      const { data: lessons } = await network.get(
        `/api/v1/lesson/byclass/${selectedClass}`
      );
      return Array.isArray(lessons) ? lessons : [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await setSelectedClass(classesToTeacher[0].classId);
      } catch (error) {}
    })();
  }, [classesToTeacher]);

  useEffect(() => {
    (async () => {
      const allLessons = await fetchClassLessons();
      setLessons(allLessons);
      setFilteredLessons(allLessons);
      setLoading(false);
    })();
  }, [selectedClass]);
  console.log(selectedClass);

  return (
    <Loading size={30} loading={loading}>
      <FilterContainer>
        <TextField
          variant='outlined'
          style={{
            boxShadow: " 0 2px 3px rgba(0, 0, 0, 0.5)",
            textAlign: "center",
            backgroundColor: "white",
            marginLeft: "5%",
          }}
          label='Search'
          value={filter}
          onChange={handleFilter}
        />
        {(user.userType === "teacher" || user.userType === "admin") && (
          <>
            <Select
              style={{
                boxShadow: " 0 2px 3px rgba(0, 0, 0, 0.5)",
                marginLeft: "15px",
                backgroundColor: "white",
              }}
              value={selectedClass}
              variant='outlined'
              onChange={(e: any) => {
                setSelectedClass(e.target.value);
              }}>
              {classesToTeacher?.map((teacherClass: any) => (
                <MenuItem value={teacherClass.classId}>
                  {teacherClass.Class.name}
                </MenuItem>
              ))}
            </Select>

            <Button
              variant='outlined'
              onClick={handleOpen}
              style={{
                boxShadow: " 0 2px 3px rgba(0, 0, 0, 0.5)",
                marginLeft: "auto",
                marginRight: "5%",
                backgroundColor: "white",
              }}>
              Add Lesson
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby='simple-modal-title'
              aria-describedby='simple-modal-description'>
              {body}
            </Modal>
          </>
        )}
      </FilterContainer>

      <LessonsContainer>
        {classesToTeacher &&
          filteredLessons.map((lesson: ILesson, index: number) => (
            <Lesson
              lesson={lesson}
              index={index}
              key={lesson.id}
              classId={selectedClass}
            />
          ))}
      </LessonsContainer>
    </Loading>
  );
}

const FilterContainer = styled.div`
  background-color: ${({ theme }: { theme: any }) => theme.colors.background};
  display: flex;

  /* justify-content: center; */
  padding-bottom: 40px;
  padding-top: 40px;
`;
// function getModalStyle() {
//   // const top = 50 + rand();
//   // const left = 50 + rand();

export const modalStyle = {
  top: `50%`,
  left: `50%`,
  transform: `translate(-${50}%, -${50}%)`,
  overflowY: "scroll",
  height:'85vh',
  width:'80vw',
  minWidth:'400px'
};

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);

const LessonsContainer = styled.div`
  background-color: ${({ theme }: { theme: any }) => theme.colors.background};
  width: 100%;
  height: 100vh;
`;
