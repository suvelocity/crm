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
import Swal from "sweetalert2";
import { set } from "lodash";
import { MenuItem, Select } from "@material-ui/core";
import { ITask } from "../../../typescript/interfaces";

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
  TaskofStudents: []
) => {
  return {
    title,
    type,
    lesson,
    endDate,
    externalLink,
    TaskofStudents,
  };
};

function Row(props: { row: ReturnType<typeof createTask> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  row.TaskofStudents = useMemo(() => {
    return row.TaskofStudents.sort((tos: any) =>
      tos.status === "done" ? 1 : -1
    );
  }, []);

  const calculateSubmissionRate: () => number = () => {
    return (
      (row.TaskofStudents.reduce((sum: number, tos: any) => {
        return tos.status === "done" ? sum + 1 : sum + 0;
      }, 0) /
        row.TaskofStudents.length) *
      100
    );
  };

  const ExtractClasses: () => string = () => {
    return Array.from(
      new Set(row.TaskofStudents.map((tos: any) => tos?.Student?.Class.name))
    ).join(", ");
  };

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.title}
        </TableCell>
        <TableCell align="right">{ExtractClasses()}</TableCell>
        <TableCell align="right">{row.type}</TableCell>
        <TableCell align="right">{row.lesson}</TableCell>
        <TableCell align="right">{convertDateToString(row.endDate)}</TableCell>
        <TableCell align="right">{calculateSubmissionRate()}%</TableCell>
        <TableCell align="right">{row.externalLink}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Students
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Class</TableCell>
                    <TableCell align="right">Submission State</TableCell>
                    <TableCell align="right">Submission Date</TableCell>
                    <TableCell align="right">Submission Link</TableCell>
                    {/*  //todo maybe adding descrtiption to submition */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.TaskofStudents.map((studentRow: any) => (
                    <TableRow key={studentRow.studentId}>
                      <TableCell component="th" scope="row">
                        {studentRow?.Student?.firstName +
                          studentRow?.Student?.lastName}
                      </TableCell>
                      <TableCell>{studentRow?.Student?.Class.name}</TableCell>
                      <TableCell align="right">{studentRow.status}</TableCell>
                      <TableCell align="right">
                        {studentRow.updatedAt
                          ? convertDateToString(studentRow.updatedAt)
                          : "hasn't submitted yet"}
                      </TableCell>
                      <TableCell align="right">
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
      // console.log(data);
      const newArray = await data.map((task: any) => {
        task.TaskofStudents.forEach((taskofstudent: any) => {
          console.log(taskofstudent);
        });
      });

      setTeacherTasks(data);
    } catch (error) {
      return Swal.fire("Error", error, "error");
    }
  };

  const getFilterOptins: () => Promise<void> = async () => {
    const { data: options }: { data: any } = await network.get(
      `/api/v1/task/options/${user.id}`
    );
    console.log(options);
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

  const taskArray = teacherTasks?.map((task: any) => {
    return createTask(
      task.title,
      task.type,
      task.Lesson.title,
      task.endDate,
      task.externalLink,
      task.TaskofStudents
    );
  });

  console.log(teacherTasks);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
              <b>Task</b>
            </TableCell>
            <TableCell align="right">
              <b>Class</b>
              <Select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value as string)}
              >
                <MenuItem value=".">All</MenuItem>
                {filterOptions?.classes?.map((cls: string, i: number) => (
                  <MenuItem key={`cls${i}`} value={cls}>
                    {cls}
                  </MenuItem>
                ))}
              </Select>
            </TableCell>
            <TableCell align="right">
              <b>Type</b>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as string)}
              >
                {/* {taskOptions().map((opt: string, i: number) => (
                  <MenuItem key={`tskopt${i}`}>{opt}</MenuItem>
                ))} */}
                <MenuItem value=".">All</MenuItem>
                {filterOptions?.taskTypes?.map((tsktp: string, i: number) => (
                  <MenuItem key={`tsktp${i}`} value={tsktp}>
                    {tsktp}
                  </MenuItem>
                ))}
              </Select>
            </TableCell>
            <TableCell align="right">
              <b>Lesson</b>
            </TableCell>
            <TableCell align="right">
              <b>deadline</b>
            </TableCell>
            <TableCell align="right">
              <b>Submittions&nbsp;(%)</b>
            </TableCell>
            <TableCell align="right">
              <b>Link</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {taskArray?.map((row: any) => (
            <Row key={row.title} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
