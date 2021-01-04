import React, { useCallback, useEffect, useMemo, useState } from "react";
import network from "../../../helpers/network";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import LinkIcon from "@material-ui/icons/Link";
import Swal from "sweetalert2";
import { MenuItem, Select } from "@material-ui/core";
import { Center, StyledAtavLink } from "../../../styles/styledComponents";
import LinearProgress from "@material-ui/core/LinearProgress";
import {
  makeStyles,
  createStyles,
  withStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

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

  const GreenBorderLinearProgress = withStyles((theme: Theme) =>
    createStyles({
      root: {
        height: 10,
        borderRadius: 5,
      },
      colorPrimary: {
        backgroundColor:
          theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
      },
      bar: {
        borderRadius: 5,
        backgroundColor: "#6ae21b",
      },
    })
  )(LinearProgress);
  const RedBorderLinearProgress = withStyles((theme: Theme) =>
    createStyles({
      root: {
        height: 10,
        borderRadius: 5,
      },
      colorPrimary: {
        backgroundColor:
          theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
      },
      bar: {
        borderRadius: 5,
        backgroundColor: "#e2321b",
      },
    })
  )(LinearProgress);
  const YellowBorderLinearProgress = withStyles((theme: Theme) =>
    createStyles({
      root: {
        height: 10,
        borderRadius: 5,
      },
      colorPrimary: {
        backgroundColor:
          theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
      },
      bar: {
        borderRadius: 5,
        backgroundColor: "#e4e719",
      },
    })
  )(LinearProgress);

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
          <p> {Math.floor(calculatedSubmissionRate)}%</p>
          {calculatedSubmissionRate < 30 ? (
            <RedBorderLinearProgress
              variant="determinate"
              value={calculatedSubmissionRate}
            />
          ) : calculatedSubmissionRate < 70 ? (
            <YellowBorderLinearProgress
              variant="determinate"
              value={calculatedSubmissionRate}
            />
          ) : (
            <GreenBorderLinearProgress
              variant="determinate"
              value={calculatedSubmissionRate}
            />
          )}
        </TableCell>
        <TableCell align="center">
          <StyledAtavLink href={row.externalLink} target="_blank">
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
                          " " +
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

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}
const useStyles1 = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
    },
  })
);

function TablePaginationActions(props: TablePaginationActionsProps) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}
//needs to be array of tasks given

export default function TeacherTaskBoard(props: any) {
  const { user } = props;
  const [teacherTasks, setTeacherTasks] = useState<any>();
  const [filterOptions, setFilterOptions] = useState<any>();
  const [classFilter, setClassFilter] = useState<string>(".");
  const [typeFilter, setTypeFilter] = useState<string>(".");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  const taskArray =
    teacherTasks?.map((task: any) => {
      return createTask(
        task.title,
        task.type,
        task.Lesson?.title,
        task.endDate,
        task.externalLink,
        task.TaskofStudents
      );
    }) || [];

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, taskArray.length - page * rowsPerPage);

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
          {/* <TableBody>
            {Array.isArray(taskArray)
              ? 
              taskArray?.map((row: any) => <Row key={row.title} row={row} />)
              : null}
          </TableBody> */}

          <TableBody>
            {Array.isArray(taskArray)
              ? taskArray
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: any) => (
                    <Row key={row.title + row.endDate} row={row} />
                  ))
              : null}
            {emptyRows > 0 && (
              <TableRow style={{ height: 91 * emptyRows }}>
                <TableCell colSpan={8} />
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={8}
                count={taskArray ? taskArray.length : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { "aria-label": "rows per page" },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      {Array.isArray(teacherTasks) && taskArray.length === 0 && (
        <Center>
          <h1>No results Found</h1>
          <SentimentVeryDissatisfiedIcon style={{ fontSize: "10em" }} />
        </Center>
      )}
    </>
  );
}
