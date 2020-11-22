import React, { useState, useEffect } from "react";
import network from "../../helpers/network";
import { Modal, Button } from "@material-ui/core";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { IJob, IStudent, IEvent } from "../../typescript/interfaces";
import CircularProgress from "@material-ui/core/CircularProgress";

function getModalStyle() {
  return {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    paper: {
      position: "absolute",
      width: "50%",
      maxWidth: 700,
      minWidth: 300,
      backgroundColor: theme.palette.background.paper,
      borderRadius: 7,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      outline: "none",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: "33.33%",
      flexShrink: 0,
      fontWeight: theme.typography.fontWeightBold,
      marginTop: 11,
    },
    button: {
      textAlign: "center",
      margin: 10,
    },
  })
);

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
  const [students, setStudents] = useState<IStudent[] | null>();
  const [studentsToApply, setStudentsToApply] = useState<string[]>([]);

  useEffect(() => {
    try {
      (async () => {
        const { data }: { data: IStudent[] } = await network.get(
          "/api/v1/student/all"
        );
        setStudents(
          data.filter(
            (student: IStudent) => !currentStudents?.includes(student.id)
          )
        );
      })();
    } catch (e) {
      console.log(e.message);
    }
  }, [currentStudents]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (studentsToApply.length > 0) {
      try {
        await network.patch(`/api/v1/job/modify-students/${jobId}`, {
          method: "add",
          students: studentsToApply,
        });
        getJob();
        handleClose();
      } catch (e) {
        console.log(e);
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
  let body = <CircularProgress />;
  if (students) {
    body = (
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.root}>
          <h1>Choose Students To Apply</h1>
          {students.length > 0 ? (
            <>
              {students?.map((student: IStudent) => (
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
                      <ListItem>
                        <ListItemText
                          primary="Name"
                          secondary={student.firstName + " " + student.lastName}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Email"
                          secondary={student.email}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Phone Number"
                          secondary={student.phone}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Course"
                          secondary={student.Class?.name}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Applied Jobs"
                          secondary={
                            <>
                              {student.Events.map((event: IEvent) => (
                                <p key={event.Job?.id}>
                                  {event.Job?.position} {event.Job?.company}
                                </p>
                              ))}
                            </>
                          }
                        />
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
              <Button
                style={{ backgroundColor: "#bb4040", color: "white" }}
                className={classes.button}
                color="primary"
                onClick={handleSubmit}
              >
                Apply
              </Button>
            </>
          ) : (
            <h2>All students are applied for this job</h2>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Button
        style={{ backgroundColor: "#bb4040", color: "white" }}
        variant="contained"
        onClick={handleOpen}
      >
        Assign a Student
      </Button>
      <Modal open={open} onClose={handleClose}>
        {body}
      </Modal>
    </>
  );
}

export default ApplyForJobModal;
