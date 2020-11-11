import React, { useCallback, useEffect, useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import EmailIcon from "@material-ui/icons/Email";
import { H1, Wrapper, TitleWrapper } from "../styles/styledComponents";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import DialpadIcon from "@material-ui/icons/Dialpad";
import SubjectIcon from "@material-ui/icons/Subject";
import ClassIcon from "@material-ui/icons/Class";
import ApplyStudentModal from "./ApplyStudentModal";
import { useParams } from "react-router-dom";
import network from "../helpers/network";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { IStudent, IJob } from "../typescript/interfaces";
import DateRangeIcon from "@material-ui/icons/DateRange";
import BusinessIcon from "@material-ui/icons/Business";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: "33.33%",
      flexShrink: 0,
      fontWeight: theme.typography.fontWeightBold,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  })
);

function SingleStudent() {
  const [student, setStudent] = useState<IStudent | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();
  const classes = useStyles();

  const getStudent = useCallback(async () => {
    const { data }: { data: IStudent } = await network.get(
      `/api/v1/student/byId/${id}`
    );
    setStudent(data);
    setLoading(false);
  }, [id, setStudent, setLoading]);

  useEffect(() => {
    try {
      getStudent();
    } catch (e) {
      console.log(e.message);
    }
  }, []);

  return (
    <>
      <Wrapper>
        <TitleWrapper>
          <H1>Student Info</H1>
        </TitleWrapper>
        <Loading size={30} loading={loading}>
          <List>
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText
                primary="Name"
                secondary={student?.firstName + " " + student?.lastName}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText primary="Email" secondary={student?.email} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PhoneIcon />
              </ListItemIcon>
              <ListItemText primary="Phone Number" secondary={student?.phone} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DialpadIcon />
              </ListItemIcon>
              <ListItemText primary="ID Number" secondary={student?.idNumber} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SubjectIcon />
              </ListItemIcon>
              <ListItemText
                primary="Description"
                secondary={student?.description}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ClassIcon />
              </ListItemIcon>
              <ListItemText primary="Course" secondary={student?.class} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DateRangeIcon />
              </ListItemIcon>
              <ListItemText primary="Age" secondary={student?.age} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText primary="Address" secondary={student?.address} />
            </ListItem>
          </List>
        </Loading>
      </Wrapper>
      <Wrapper>
        <TitleWrapper>
          <H1>Student Job Processes</H1>
        </TitleWrapper>
        <br />
        <Loading loading={loading} size={30}>
          {student?.jobs.map((job: Partial<IJob>) => (
            <Accordion key={job.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-label="Expand"
                aria-controls="additional-actions2-content"
                id="additional-actions2-header"
              >
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
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
          <br />
          <ApplyStudentModal
            currentJobs={student?.jobs.map((job: Partial<IJob>) => job.id)}
            studentId={student?.id}
            getStudent={getStudent}
          />
        </Loading>
      </Wrapper>
    </>
  );
}

export default SingleStudent;
