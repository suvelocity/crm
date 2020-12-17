import React, { useEffect, useState } from "react";
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

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

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

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component='th' scope='row'>
          {row.title}
        </TableCell>
        <TableCell align='right'>{row.type}</TableCell>
        <TableCell align='right'>{row.lesson}</TableCell>
        <TableCell align='right'>{row.endDate}</TableCell>
        <TableCell align='right'>"placeholder 7/30"</TableCell>
        <TableCell align='right'>{row.externalLink}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box margin={1}>
              <Typography variant='h6' gutterBottom component='div'>
                Students
              </Typography>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Class</TableCell>
                    <TableCell align='right'>Submittion State</TableCell>
                    <TableCell align='right'>Submittion Date</TableCell>
                    <TableCell align='right'>Submittion Link</TableCell>
                    {/*  //todo maybe adding descrtiption to submition */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.TaskofStudents.map((studentRow: any) => (
                    <TableRow key={studentRow.studentId}>
                      <TableCell component='th' scope='row'>
                        {studentRow.Student.firstName +
                          studentRow.Student.lastName}
                      </TableCell>
                      <TableCell>{studentRow.Student.Class.name}</TableCell>
                      <TableCell align='right'>{studentRow.status}</TableCell>
                      <TableCell align='right'>
                        {studentRow.updatedAt
                          ? studentRow.updatedAt
                          : "hasn't submitted yet"}
                      </TableCell>
                      <TableCell align='right'>
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

  const fetchTeacherTasks = async () => {
    try {
      const { data } = await network.get(`/api/v1/task/byteacherid/${user.id}`);
      console.log(data);
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
  useEffect(() => {
    fetchTeacherTasks();
  }, []);

  const taskArray = teacherTasks?.map((task: any) => {
    return createTask(
      task.title,
      task.type,
      task.lessonId,
      task.endDate,
      task.externalLink,
      task.TaskofStudents
    );
  });
  return (
    <TableContainer component={Paper}>
      <Table aria-label='collapsible table'>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
              <b>Task</b>
            </TableCell>
            <TableCell align='right'>
              <b>Type</b>
            </TableCell>
            <TableCell align='right'>
              <b>Lesson</b>
            </TableCell>
            <TableCell align='right'>
              <b>deadline</b>
            </TableCell>
            <TableCell align='right'>
              <b>Submittions&nbsp;(%)</b>
            </TableCell>
            <TableCell align='right'>
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
