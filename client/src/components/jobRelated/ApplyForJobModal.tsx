import React, { useState, useEffect } from "react";
import network from "../../helpers/network";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { IStudent, IEvent } from "../../typescript/interfaces";
import {
  CircularProgress,
  ListItemText,
  ListItem,
  FormControlLabel,
  Checkbox,
  List,
  Typography,
  Modal,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from "@material-ui/core";
import { Loading } from "react-loading-wrapper";
import { SingleListItem } from "../tableRelated";
import "react-loading-wrapper/dist/index.css";
import Swal from "sweetalert2";

function ApplyForJobModal({
  currentStudents,
  jobId,
  getJob,
}: {
  currentStudents: (number | undefined)[] | undefined;
  jobId: number | undefined;
  getJob: () => void;
}) {
  const classes = useStyles();
  const modalStyle = getModalStyle();
  const [open, setOpen] = useState(false);
  const [allStudents, setAllStudents] = useState<IStudent[] | null>();
  const [filteredStudents, setFilteredStudents] = useState<IStudent[]>([]);
  const [studentsToApply, setStudentsToApply] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      (async () => {
        const { data }: { data: IStudent[] } = await network.get(
          "/api/v1/student/all"
        );
        const fetchedStudents: IStudent[] = data.filter(
          (student: IStudent) => !currentStudents?.includes(student.id)
        );

        setAllStudents(fetchedStudents);
        setFilteredStudents(fetchedStudents);
      })();
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
  }, [currentStudents]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setFilteredStudents([]);
    setOpen(false);
  };

  const handleSubmit = () => {
    if (studentsToApply.length > 0) {
      try {
        setLoading(true);
        Array.from(new Set(studentsToApply)).forEach(
          async (studentId: string) => {
            await network.post(`/api/v1/event`, {
              userId: studentId,
              relatedId: jobId,
              type: "jobs",
              date: new Date().setHours(0, 0, 0, 0),
              eventName: "Started application process",
            });
          }
        );
        setTimeout(() => {
          getJob();
          setLoading(false);
          handleClose();
        }, 1000);
      } catch (error) {
        Swal.fire("Error Occurred", error.message, "error");
      }
    } else {
      handleClose();
    }
  };

  const handleCheckBoxOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setStudentsToApply((prev) => [...prev, e.target.value]);
    } else {
      setStudentsToApply((prev) =>
        prev.filter((item) => item !== e.target.value)
      );
    }
  };

  // TODO change search to server side
  const search = (searchQuery: string) => {
    if (!searchQuery) {
      setFilteredStudents(allStudents!);
      return;
    }
    if (!allStudents) return;
    setFilteredStudents(
      allStudents?.filter(
        (student: IStudent) =>
          new RegExp(`^${searchQuery}`, "i").test(`${student.firstName}`) ||
          new RegExp(`^${searchQuery}`, "i").test(`${student.lastName}`)
      )
    );
  };
  let body = <CircularProgress />;
  if (filteredStudents) {
    body = (
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.accordionContainer}>
          <h1>Choose Students To Apply</h1>
          <TextField
            id="searchStudentToApply"
            fullWidth
            label={"Search student"}
            onChange={(e) => search(e.target.value)}
          />
          {allStudents && allStudents.length > 0 ? (
            <>
              {filteredStudents.length > 0
                ? filteredStudents.map((student: IStudent) => (
                    <Accordion key={student.id}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-label="Expand"
                        aria-controls="additional-actions2-content"
                        id="additional-actions2-header"
                      >
                        <FormControlLabel
                          aria-label="Acknowledge"
                          onClick={(event) => event.stopPropagation()}
                          onFocus={(event) => event.stopPropagation()}
                          control={
                            <Checkbox
                              id={`${student.id}`}
                              value={student.id}
                              onChange={handleCheckBoxOnChange}
                            />
                          }
                          label=""
                        />
                        <Typography className={classes.heading}>
                          {student.firstName} {student.lastName}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List dense>
                          <SingleListItem
                            primary="Name"
                            secondary={`${student.firstName} ${student.lastName}`}
                          />
                          <SingleListItem
                            primary="Email"
                            secondary={student.email}
                          />
                          <SingleListItem
                            primary="Phone Number"
                            secondary={student.phone}
                          />
                          <ListItem>
                            <ListItemText
                              primary="Course"
                              secondary={student.Class?.name}
                            />
                          </ListItem>
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  ))
                : null}
            </>
          ) : (
            <h2>No students available</h2>
          )}
        </div>
        <Button
          style={{
            backgroundColor: "#bb4040",
            color: "white",
          }}
          className={classes.button}
          color="primary"
          onClick={handleSubmit}
          id="apply"
        >
          Apply
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        id="assignStudent"
        style={{ backgroundColor: "#bb4040", color: "white" }}
        variant="contained"
        onClick={handleOpen}
      >
        Assign a Student
      </Button>
      <Modal style={{ overflow: "scroll" }} open={open} onClose={handleClose}>
        <Loading loading={loading}>{body}</Loading>
      </Modal>
    </>
  );
}

export default ApplyForJobModal;

function getModalStyle() {
  return {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    accordionContainer: {
      width: "100%",
      maxHeight: "82vh",
      overflow: "scroll",
    },
    paper: {
      position: "absolute",
      width: "50%",
      maxWidth: 700,
      minWidth: 300,
      maxHeight: "80%",
      backgroundColor: theme.palette.background.paper,
      borderRadius: 7,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      outline: "none",
      paddingBottom: 80,
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: "33.33%",
      flexShrink: 0,
      fontWeight: theme.typography.fontWeightBold,
      marginTop: 11,
    },
    button: {
      // textAlign: "center",
      // // margin: "10 auto",
      margin: "20px 0",
    },
  })
);
