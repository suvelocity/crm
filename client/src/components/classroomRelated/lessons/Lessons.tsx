import React, { useState, useEffect, useContext } from "react";
import {
  Fade,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Loading } from "react-loading-wrapper";
import AddLesson from "./AddLesson";
import network from "../../../helpers/network";
import { AuthContext } from "../../../helpers";
import styled from "styled-components";
import { IClassOfTeacher, ILesson } from "../../../typescript/interfaces";
import Lesson from "./Lesson";
import { classesOfTeacher } from "../../../atoms";
import { useRecoilValue } from "recoil";
import { fetchSuperChallenges } from "./FccSelector";
import { StyledButton } from "../teacher/Teacher";
import AddCircleIcon from "@material-ui/icons/AddCircle";

export default function Lessons() {
  const [loading, setLoading] = useState<boolean>(true);

  const classesToTeacher = useRecoilValue(classesOfTeacher);

  const classes = useStyles();
  // const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = useState<boolean>(false);
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [filteredLessons, setFilteredLessons] = React.useState<ILesson[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [render, setRender] = useState<boolean>(false);
  const [fccChallenges, setFccChallenges] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = React.useState<number>(
    classesToTeacher[0]?.classId
  );

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
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
  const lessonAdded = () => {
    (async () => {
      const allLessons = await fetchClassLessons();
      setLessons(allLessons);
      setFilteredLessons(allLessons);
      setLoading(false);
    })();
  };

  const fetchClassLessons = async () => {
    try {
      const { data: lessons } = await network.get(
        `/api/v1/lesson/byclass/${selectedClass ? selectedClass : user.classId}`
      );
      return Array.isArray(lessons) ? lessons : [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const fchallenges = await fetchSuperChallenges();
        await setFccChallenges(fchallenges);
      } catch (error) {}
    })();
  }, []);

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

  const body = (
    //@ts-ignore
    <div style={modalStyle} className={classes.paper}>
      <AddLesson
        setOpen={setOpen}
        classId={selectedClass}
        lessonAdded={lessonAdded}
      />
    </div>
  );

  const TeacherControls = () => (
    <>
      <Select
        id='class-select'
        labelId='class-select-label'
        style={{
          height: "fit-content",
          boxShadow: " 0 2px 3px rgba(0, 0, 0, 0.5)",
          marginLeft: "15px",
          backgroundColor: "white",
        }}
        defaultValue={selectedClass}
        onChange={(e: any) => {
          const newId = e.target.value;
          setSelectedClass(newId);
        }}
        variant='outlined'>
        {classesToTeacher?.map((classOfTeacher) => (
          <MenuItem value={classOfTeacher.classId}>
            {classOfTeacher.Class.name}
          </MenuItem>
        ))}
      </Select>
      <StyledButton
        onClick={handleOpen}
        style={{ marginLeft: "auto", marginRight: "15%", height: "auto" }}>
        New Lesson
        <AddCircleIcon
          style={{ fontSize: "1.3em", marginLeft: "0.5vw" }}
        />{" "}
      </StyledButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'>
        <Fade in={open} timeout={600}>
          {body}
        </Fade>
      </Modal>
    </>
  );

  return (
    <Loading size={30} loading={loading}>
      <Typography
        variant='h2'
        style={{
          marginRight: 15,
          marginTop: "2%",
          marginBottom: "auto",
          marginLeft: "15%",
        }}>
        Lessons
      </Typography>
      <FilterContainer>
        <TextField
          label='Search'
          value={filter}
          style={{
            borderRadius: "4px",
            height: "fit-content",
            boxShadow: " 0 2px 3px rgba(0, 0, 0, 0.5)",
            textAlign: "center",
            backgroundColor: "white",
            marginLeft: "15%",
          }}
          onChange={handleFilter}
          variant='outlined'
        />
        {user.userType === "teacher" && <TeacherControls />}
      </FilterContainer>
      <hr
        style={{
          width: "60%",
          opacity: "50%",
          margin: 0,
          marginLeft: "auto",
          marginRight: "auto",
          boxShadow: "1px",
        }}
      />
      <LessonsContainer>
        {classesToTeacher && filteredLessons.length ? (
          filteredLessons.map((lesson: ILesson, index: number) => (
            <Lesson
              lesson={lesson}
              index={filteredLessons.length - index}
              key={lesson.id}
              classId={selectedClass}
            />
          ))
        ) : (
          <ul>
            {" "}
            No Lessons Found with filters:
            <li>search: "{filter}"</li>
            <li>
              class:{" "}
              {
                classesToTeacher.find(
                  (single) => single.classId === selectedClass
                )?.Class.name
              }
            </li>
          </ul>
        )}
      </LessonsContainer>
    </Loading>
  );
}

const FilterContainer = styled.div`
  background-color: ${({ theme }: { theme: any }) => theme.colors.background};
  display: flex;
  height: fit-content;
  /* justify-content: center; */
  padding-bottom: 40px;
  padding-top: 40px;
`;
// function getModalStyle() {
//   // const top = 50 + rand();
//   // const left = 50 + rand();

export const modalStyle = {
  transition: ".5sec",
  top: `50%`,
  left: `50%`,
  transform: `translate(-${50}%, -${50}%)`,
  overflowY: "scroll",
  height: "85vh",
  width: "80vw",
  minWidth: "400px",
  zIndex: 20,
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
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  })
);

const LessonsContainer = styled.div`
  background-color: ${({ theme }: { theme: any }) => theme.colors.background};
  width: 100%;
  height: 100vh;
  margin-top: 2%;
`;
