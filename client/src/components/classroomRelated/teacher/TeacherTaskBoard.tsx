import React, { useCallback, useEffect, useMemo, useState } from "react";
import network from "../../../helpers/network";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import LinkIcon from "@material-ui/icons/Link";
import Swal from "sweetalert2";
import { set } from "lodash";
import { MenuItem, Select } from "@material-ui/core";
import { ITask } from "../../../typescript/interfaces";
import { Center, StyledAtavLink } from "../../../styles/styledComponents";
import styled from "styled-components";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

export function convertDateToString(date: Date) {
  let today = new Date(date);
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const generatedDate = `${yyyy}-${mm}-${dd}`;
  return `${generatedDate}`;
}

const createTask = (
  title: string,
  type: string,
  lesson: string,
  endDate: Date,
  externalLink: string,
  TaskOfStudents: []
) => {
  return {
    title,
    type,
    lesson,
    endDate,
    externalLink,
    TaskOfStudents,
  };
};

function Row(props: { row: ReturnType<typeof createTask> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  row.TaskOfStudents = useMemo(() => {
    return row.TaskOfStudents.sort((tos: any) =>
      tos.status === "done" ? 1 : -1
    );
  }, []);

  const calculatedSubmissionRate = useMemo(() => {
    return (
      (row.TaskOfStudents.reduce((sum: number, tos: any) => {
        return tos.status === "done" ? sum + 1 : sum + 0;
      }, 0) /
        row.TaskOfStudents.length) *
      100
    );
  }, []);

  const classList: string = useMemo(() => {
    return Array.from(
      new Set(row.TaskOfStudents.map((tos: any) => tos?.Student?.Class.name))
    ).join(", ");
  }, []);

  const convertedDate = useMemo(() => {
    return convertDateToString(row.endDate);
  }, []);

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            style={{ width: "2vw" }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.title}
        </TableCell>
        <TableCell align="center">{classList}</TableCell>
        <TableCell align="center">{row.type}</TableCell>
        <TableCell align="center">{row.lesson}</TableCell>
        <TableCell align="center">{convertedDate}</TableCell>
        <TableCell align="center">
          {Math.floor(calculatedSubmissionRate)}%
        </TableCell>
        <TableCell align="center">
          <StyledAtavLink href={row.externalLink}>
            <LinkIcon />
          </StyledAtavLink>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Students
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Full Name</b>
                    </TableCell>
                    <TableCell>
                      <b>Class</b>
                    </TableCell>
                    <TableCell align="left">
                      <b>Submission State</b>
                    </TableCell>
                    <TableCell align="left">
                      <b>Submission Date</b>
                    </TableCell>
                    <TableCell align="left">
                      <b>Submission Link</b>
                    </TableCell>
                    {/*  //todo maybe adding descrtiption to submition */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.TaskOfStudents.map((studentRow: any) => (
                    <TableRow key={studentRow.studentId}>
                      <TableCell component="th" scope="row">
                        {studentRow?.Student?.firstName +
                          studentRow?.Student?.lastName}
                      </TableCell>
                      <TableCell>{studentRow?.Student?.Class.name}</TableCell>
                      <TableCell align="left">{studentRow.status}</TableCell>
                      <TableCell align="left">
                        {studentRow.updatedAt
                          ? convertDateToString(studentRow.updatedAt)
                          : "hasn't submitted yet"}
                      </TableCell>
                      <TableCell align="left">
                        {studentRow.submitLink ? studentRow.submitLink : "none"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

//needs to be array of tasks given

export default function TeacherTaskBoard(props: any) {
  const { user } = props;
  const [teacherTasks, setTeacherTasks] = useState<any>();
  const [filterOptions, setFilterOptions] = useState<any>();
  const [classFilter, setClassFilter] = useState<string>(".");
  const [typeFilter, setTypeFilter] = useState<string>(".");

  const fetchTeacherTasks = async () => {
    const filter = makeFilter();
    try {
      const { data } = await network.get(
        `/api/v1/task/byteacherid/${user.id}`,
        { params: { filters: filter } }
      );

      setTeacherTasks(data);
    } catch (error) {
      return Swal.fire("Error", error, "error");
    }
  };

  const getFilterOptins: () => Promise<void> = async () => {
    const { data: options }: { data: any } = await network.get(
      `/api/v1/task/options/${user.id}`
    );
    setFilterOptions(options);
  };

  const makeFilter = useCallback(() => {
    const filter: any = {};
    if (classFilter && classFilter !== ".") filter.class = classFilter;
    if (typeFilter && typeFilter !== ".") filter.type = typeFilter;
    return filter;
  }, [classFilter, typeFilter]);

  useEffect(() => {
    fetchTeacherTasks();
  }, [typeFilter, classFilter]);

  useEffect(() => {
    getFilterOptins();
  }, []);

  // console.log(teacherTasks);

  const taskArray = teacherTasks?.map((task: any) => {
    return createTask(
      task.title,
      task.type,
      task.Lesson?.title,
      task.endDate,
      task.externalLink,
      task.TaskOfStudents
    );
  });

  console.log(teacherTasks);
  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "2vw" }} />
              <TableCell style={{ width: "5vw" }}>
                <b>Task</b>
              </TableCell>
              <TableCell align="center" style={{ width: "16vw" }}>
                <b>Class</b>
                <Select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value as string)}
                  style={{ width: "160px", marginLeft: "1vw" }}
                >
                  <MenuItem value=".">All</MenuItem>
                  {filterOptions?.classes?.map((cls: string, i: number) => (
                    <MenuItem key={`cls${i}`} value={cls}>
                      {cls}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell align="center" style={{ width: "16vw" }}>
                <b>Type</b>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as string)}
                  style={{ width: "160px", marginLeft: "1vw" }}
                >
                  <MenuItem value=".">All</MenuItem>
                  {filterOptions?.taskTypes?.map((tsktp: string, i: number) => (
                    <MenuItem key={`tsktp${i}`} value={tsktp}>
                      {tsktp}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell align="center" style={{ width: "8vw" }}>
                <b>Lesson</b>
              </TableCell>
              <TableCell align="center" style={{ width: "8vw" }}>
                <b>Deadline</b>
              </TableCell>
              <TableCell align="center" style={{ width: "10vw" }}>
                <b>Submissions&nbsp;(%)</b>
              </TableCell>
              <TableCell align="center" style={{ width: "6vw" }}>
                <b>Link</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(taskArray)
              ? taskArray?.map((row: any) => <Row key={row.title} row={row} />)
              : null}
          </TableBody>
        </Table>
      </TableContainer>
      {Array.isArray(taskArray) && taskArray.length === 0 && (
        <Center>
          <h1>No results Found</h1>
          <SentimentVeryDissatisfiedIcon style={{ fontSize: "10em" }} />
        </Center>
      )}
    </>
  );
}
