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

export default function Lessons() {
  const [loading, setLoading] = useState<boolean>(true);
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState<boolean>(false);
  const [lessons, setLessons] = React.useState<ILesson[]>([]);
  const [filteredLessons, setFilteredLessons] = React.useState<ILesson[]>([]);
  const [filter, setFilter] = React.useState<string>("");

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilter(value);
    setFilteredLessons(() =>
      lessons.filter((lesson: ILesson) => {
        for (let item of Object.values(lesson)) {
          if (item.toString().toLowerCase().includes(value.toLowerCase())) {
            return true;
          }
        }
      })
    );
  };

  //@ts-ignore
  const { user } = useContext(AuthContext);
  const classId = 1;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const body = (
    <div style={modalStyle} className={classes.paper}>
      <AddLesson setOpen={setOpen} />
    </div>
  );
  const fetchClassLessons = async () => {
    try {
      const { data: lessons } = await network.get(
        `/api/v1/lesson/byclass/${classId}`
      );
      return Array.isArray(lessons) ? lessons : [];
    } catch {
      return [];
    }
  };
  useEffect(() => {
    (async () => {
      const allLessons = await fetchClassLessons();
      setLessons(allLessons);
      setFilteredLessons(allLessons);
      setLoading(false);
    })();
  }, [open]);

  return (
    <Loading size={30} loading={loading}>
      <FilterContainer>
        <TextField
          variant='outlined'
          style={{ textAlign: "center" }}
          label='Search'
          value={filter}
          onChange={handleFilter}
        />
      </FilterContainer>
      <LessonsContainer>
        {filteredLessons.map((lesson: ILesson, index: number) => (
          <Lesson lesson={lesson} index={index} key={lesson.id} />
        ))}
        {(user.userType === "teacher" || user.userType === "admin") && (
          <>
            <Button variant='outlined' onClick={handleOpen}>
              Add Lesson
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby='simple-modal-title'
              aria-describedby='simple-modal-description'
            >
              {body}
            </Modal>
          </>
        )}
      </LessonsContainer>
    </Loading>
  );
}
function rand() {
  return Math.round(Math.random() * 20) - 10;
}
const FilterContainer = styled.div`
  background-color: ${({ theme }: { theme: any }) => theme.colors.background};
  display: flex;
  justify-content: center;
  padding: 20px;
`;

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

const LessonsContainer = styled.div`
  background-color: ${({ theme }: { theme: any }) => theme.colors.background};
  width: 100%;
  height: 100vh;
`;
