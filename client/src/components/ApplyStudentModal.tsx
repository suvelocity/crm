import React, { useState, useEffect } from "react";
import network from "../helpers/network";
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
import { IJob, IStudent, IEvent } from "../typescript/interfaces";
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
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
      marginTop: 11,
    },
    button: {
      textAlign: "center",
      margin: 10,
    },
  })
);

function ApplyStudentModal({
  currentJobs,
  studentId,
  getStudent,
}: {
  currentJobs: (number | undefined)[] | undefined;
  studentId: number | undefined;
  getStudent: () => void;
}) {
  const classes = useStyles();
  const modalStyle = getModalStyle();
  const [open, setOpen] = useState(false);
  const [jobs, setJobs] = useState<IJob[] | null>();
  const [jobsToApply, setJobsToApply] = useState<string[]>([]);

  useEffect(() => {
    try {
      (async () => {
        const { data }: { data: IJob[] } = await network.get("/api/v1/job/all");
        setJobs(data.filter((job: IJob) => !currentJobs?.includes(job.id)));
      })();
    } catch (e) {
      console.log(e.message);
    }
  }, [currentJobs]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (jobsToApply.length > 0) {
      try {
        await network.patch(`/api/v1/student/modify-jobs/${studentId}`, {
          method: "add",
          jobs: jobsToApply,
        });
        getStudent();
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
      setJobsToApply((prev) => [...prev, e.target.value]);
    } else {
      setJobsToApply((prev) => prev.filter((item) => item !== e.target.value));
    }
  };
  let body = <CircularProgress />;
  if (jobs) {
    body = (
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.root}>
          <h1>Choose Jobs To Apply To</h1>
          {jobs.length > 0 ? (
            <>
              {jobs?.map((job: IJob) => (
                <Accordion key={job.id}>
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
                          id={`${job.id}`}
                          value={job.id}
                          onChange={handleCheckBoxOnChange}
                        />
                      }
                      label=""
                    />
                    <Typography className={classes.heading}>
                      {job.position}
                    </Typography>
                    <Typography className={classes.secondaryHeading}>
                      {job.company}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Requirements"
                          secondary={job.requirements}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Location"
                          secondary={job.location}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Applied Students"
                          secondary={
                            <>
                              {job.Events.map((event: IEvent) => (
                                <p key={event?.Student?.id}>
                                  {event?.Student?.firstName}{" "}
                                  {event?.Student?.lastName}
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
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Apply
              </Button>
            </>
          ) : (
            <h2>Student is already applied for all jobs</h2>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Apply for a job
      </Button>
      <Modal open={open} onClose={handleClose}>
        {body}
      </Modal>
    </>
  );
}

export default ApplyStudentModal;
