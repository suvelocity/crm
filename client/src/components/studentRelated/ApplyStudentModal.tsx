import React, { useState, useEffect } from "react";
import network from "../../helpers/network";
import { Modal, Button, TextField } from "@material-ui/core";
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
import { IJob, IEvent } from "../../typescript/interfaces";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { SingleListItem } from "../tableRelated";
import Swal from "sweetalert2";

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
  const [allJobs, setAllJobs] = useState<IJob[] | null>();
  const [filteredJobs, setFilteredJobs] = useState<IJob[]>([]);
  const [jobsToApply, setJobsToApply] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      (async () => {
        const { data }: { data: IJob[] } = await network.get("/api/v1/job/all");
        const fetchedJobs: IJob[] = data.filter(
          (job: IJob) => !currentJobs?.includes(job.id)
        );
        setAllJobs(fetchedJobs);
        setFilteredJobs(fetchedJobs);
      })();
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
  }, [currentJobs]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setFilteredJobs(allJobs!);
    setOpen(false);
  };

  const handleSubmit = () => {
    if (jobsToApply.length > 0) {
      try {
        setLoading(true);
        Array.from(new Set(jobsToApply)).forEach(async (jobId: string) => {
          await network.post(`/api/v1/event`, {
            userId: studentId,
            relatedId: jobId,
            eventName: "Started application process",
            date: new Date().setHours(0, 0, 0, 0),
            type: "jobs",
          });
        });
        setTimeout(() => {
          getStudent();
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
      setJobsToApply((prev) => [...prev, e.target.value]);
    } else {
      setJobsToApply((prev) => prev.filter((item) => item !== e.target.value));
    }
  };

  // TODO Move search to server side
  const search = (searchQuery: string) => {
    if (!searchQuery) {
      setFilteredJobs(allJobs!);
      return;
    }
    if (!allJobs) return;
    setFilteredJobs(
      allJobs?.filter(
        (job: IJob) =>
          new RegExp(`^${searchQuery}`, "i").test(`${job.position}`) ||
          new RegExp(`^${searchQuery}`, "i").test(`${job.Company.name}`)
      )
    );
  };

  let body = <CircularProgress />;
  if (allJobs) {
    body = (
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.accordionContainer}>
          <h1>Choose Jobs To Apply To</h1>
          <TextField
            id="searchJobsToApply"
            fullWidth
            label={"Search job"}
            onChange={(e) => search(e.target.value)}
          />
          {allJobs.length > 0 ? (
            <>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job: IJob) => (
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
                        {job.Company.name}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        <SingleListItem
                          primary="Requirements"
                          secondary={job.requirements}
                        />
                        <SingleListItem
                          primary="Location"
                          secondary={job.location}
                        />
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <h1>No jobs found</h1>
              )}
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                id="apply"
              >
                Apply
              </Button>
            </>
          ) : (
            <h2>No available jobs</h2>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Button
        id="applyForJob"
        variant="contained"
        color="primary"
        onClick={handleOpen}
      >
        Apply for a job
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Loading loading={loading}>{body}</Loading>
      </Modal>
    </>
  );
}

export default ApplyStudentModal;

function getModalStyle(): {
  top: string;
  left: string;
  transform: string;
  overflowY: "auto";
} {
  return {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    overflowY: "auto",
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    accordionContainer: {
      position: "relative",
      width: "100%",
      height: "90%",
      overflowY: "auto",
    },
    paper: {
      position: "absolute",
      width: "50%",
      maxWidth: 700,
      minWidth: 300,
      maxHeight: "80%",
      overflow: "scroll",
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
