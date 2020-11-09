import React, { useState } from "react";
import network from "../helpers/network";
import { Modal, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
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

function getModalStyle() {
  return {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    textAlign: "center",
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
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  button: {
    textAlign: "center",
    margin: 10,
  },
}));

interface IJob {
  _id: string;
  company: any;
  position: string;
  requirements: string;
  location: string;
  qualifiedStudents: any[];
}

const jobsMock: IJob[] = [
  {
    _id: "dsfhjdskfhsdf8sd",
    company: "Company1",
    position: "Frontend Developer",
    requirements: "React, Node",
    location: "Tel Aviv",
    qualifiedStudents: ["amir", "nitzan"],
  },
  {
    _id: "dsfhjdskfsdfdsfhsdf8sd",
    company: "Company1",
    position: "Full Stack Developer",
    requirements: "React, Node",
    location: "Tel Aviv",
    qualifiedStudents: ["amir", "zach"],
  },
  {
    _id: "dsfhjdskfhsdf8dsfdsfsd",
    company: "Company2",
    position: "Backend Developer",
    requirements: "React, Node",
    location: "Tel Aviv",
    qualifiedStudents: ["shahar", "nitzan"],
  },
];

function ApplyStudentModal() {
  const classes = useStyles();
  const modalStyle = getModalStyle();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className={classes.root}>
        {jobsMock.map((job: IJob) => (
          <Accordion>
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
                    value={job._id}
                    onChange={(e) => {
                      if (e.target.checked) console.log(e.target.value);
                    }}
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
                  <ListItemText primary="Location" secondary={job.location} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Applied Students"
                    secondary={job.qualifiedStudents.map((student) => (
                      <p>{student}</p>
                    ))}
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
      <Button className={classes.button} variant="contained" color="primary">
        Apply
      </Button>
    </div>
  );

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
