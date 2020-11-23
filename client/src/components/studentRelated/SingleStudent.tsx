import React, { useCallback, useEffect, useState } from "react";
import NewEventModal from "./NewEventModal";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import EmailIcon from "@material-ui/icons/Email";
import {
  H1,
  Wrapper,
  TitleWrapper,
  Center,
  RemoveJobButton,
} from "../../styles/styledComponents";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import DialpadIcon from "@material-ui/icons/Dialpad";
import SubjectIcon from "@material-ui/icons/Subject";
import ClassIcon from "@material-ui/icons/Class";
import ApplyStudentModal from "./ApplyStudentModal";
import { useParams } from "react-router-dom";
import network from "../../helpers/network";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { IStudent, IJob, IEvent } from "../../typescript/interfaces";
import DateRangeIcon from "@material-ui/icons/DateRange";
import BusinessIcon from "@material-ui/icons/Business";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import WorkIcon from "@material-ui/icons/Work";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import PostAddIcon from "@material-ui/icons/PostAdd";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import IconButton from "@material-ui/core/IconButton";
import Swal from "sweetalert2";
import EventsLog from "../EventLog";
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
      marginLeft: 10,
      marginTop: 3,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    iconButton: {
      fontSize: theme.typography.pxToRem(10),
      padding: 0,
      marginLeft: "auto",
    },
    details: {
      height: "auto",
      padding: "20px",
    },
  })
);

function SingleStudent() {
  const [student, setStudent] = useState<IStudent | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [eventsToMap, setEventsToMap] = useState<IEvent[]>([]);
  const { id } = useParams();
  const classes = useStyles();

  const getStudent = useCallback(async () => {
    const { data }: { data: IStudent } = await network.get(
      `/api/v1/student/byId/${id}`
    );
    const uniqueJobs: IEvent[] = [];
    data.Events.forEach((event: IEvent) => {
      if (!uniqueJobs.find((ev: IEvent) => ev.Job!.id === event.Job!.id)) {
        uniqueJobs.push(event);
      }
    });
    setEventsToMap(uniqueJobs);
    setStudent(data);
    setLoading(false);
  }, [id, setStudent, setLoading, setEventsToMap]);

  const removeJob = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      jobId: number
    ) => {
      e.stopPropagation();
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result: { isConfirmed: boolean }) => {
        if (result.isConfirmed) {
          await network.patch("/api/v1/event/delete", {
            studentId: student?.id!,
            jobId,
          });
          getStudent();
        }
      });
    },
    [setStudent, id, student, getStudent]
  );

  useEffect(() => {
    try {
      getStudent();
    } catch (e) {
      console.log(e.message);
    }
    //eslint-disable-next-line
  }, []);

  return (
    <>
      <Wrapper>
        <Center>
          <TitleWrapper>
            <H1>Student Info</H1>
          </TitleWrapper>
        </Center>
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
                <ClassIcon />
              </ListItemIcon>
              <ListItemText primary="Course" secondary={student?.Class.name} />
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
            {student?.additionalDetails && (
              <ListItem>
                <ListItemIcon>
                  <SubjectIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Additional Details"
                  secondary={student?.additionalDetails}
                />
              </ListItem>
            )}
          </List>
        </Loading>
      </Wrapper>
      <Wrapper>
        <Center>
          <TitleWrapper>
            <H1>Student Job Processes</H1>
          </TitleWrapper>
        </Center>
        <br />
        <Loading loading={loading} size={30}>
          {eventsToMap.map((event: IEvent) => (
            <Accordion key={event.Job!.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-label="Expand"
                aria-controls="additional-actions2-content"
                id="additional-actions2-header"
              >
                <WorkIcon />
                <Typography className={classes.heading}>
                  {event.Job!.position}
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  {event.Job!.company}
                </Typography>
                <Typography className={classes.iconButton}>
                  <IconButton
                    onClick={(
                      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ) => removeJob(e, event.Job!.id!)}
                    style={{ padding: 0 }}
                  >
                    <RemoveJobButton />
                  </IconButton>
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.details}>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <PostAddIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Position"}
                      secondary={event.Job!.position}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationCityIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Company"}
                      secondary={event.Job!.company}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PlaylistAddCheckIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Requirements"
                      secondary={event.Job!.requirements}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BusinessIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Location"
                      secondary={event.Job!.location}
                    />
                  </ListItem>
                </List>
                <EventsLog
                  events={
                    student?.Events.filter(
                      (ev: IEvent) => ev.Job!.id === event.Job!.id
                    )!
                  }
                />
                <NewEventModal
                  getStudent={getStudent}
                  studentId={student?.id!}
                  jobId={event.Job!.id!}
                />
              </AccordionDetails>
            </Accordion>
          ))}
          <br />
          <Center>
            <ApplyStudentModal
              currentJobs={eventsToMap.map((event: IEvent) => event.Job!.id!)}
              studentId={student?.id}
              getStudent={getStudent}
            />
          </Center>
        </Loading>
      </Wrapper>
    </>
  );
}

export default SingleStudent;
