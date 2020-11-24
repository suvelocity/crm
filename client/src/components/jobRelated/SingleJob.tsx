import React, { useCallback, useEffect, useState } from "react";
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
import { useParams } from "react-router-dom";
import network from "../../helpers/network";
import EventLog from "../EventLog";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { IStudent, IJob, IEvent } from "../../typescript/interfaces";
import DateRangeIcon from "@material-ui/icons/DateRange";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import PostAddIcon from "@material-ui/icons/PostAdd";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import BusinessIcon from "@material-ui/icons/Business";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import ApplyForJobModal from "./ApplyForJobModal";
import IconButton from "@material-ui/core/IconButton";
import Swal from "sweetalert2";
import DescriptionIcon from "@material-ui/icons/Description";
import NewEventModal from "../NewEventModal";

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
    iconButton: {
      fontSize: theme.typography.pxToRem(10),
      padding: 0,
      marginLeft: "auto",
    },
  })
);

function SingleJob() {
  const [job, setJob] = useState<IJob | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [eventsToMap, setEventsToMap] = useState<IEvent[]>([]);
  const { id } = useParams();
  const classes = useStyles();

  const getJob = useCallback(async () => {
    const { data }: { data: IJob } = await network.get(
      `/api/v1/job/byId/${id}`
    );
    const uniqueStudents: IEvent[] = [];
    data.Events.forEach((event: IEvent) => {
      if (
        !uniqueStudents.find(
          (ev: IEvent) => ev.Student!.id === event.Student!.id
        )
      ) {
        uniqueStudents.push(event);
      }
    });
    setEventsToMap(uniqueStudents);
    setJob(data);
    setLoading(false);
  }, [id, setJob, setLoading, setEventsToMap]);

  const removeStudents = useCallback(
    async (
      studentId: number,
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
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
            studentId,
            jobId: job?.id,
          });
          getJob();
        }
      });
    },
    [setJob, id, job, getJob]
  );

  useEffect(() => {
    try {
      getJob();
    } catch (e) {
      console.log(e.message);
    }
    //eslint-disable-next-line
  }, [id]);

  return (
    <>
      <Wrapper>
        <Center>
          <TitleWrapper>
            <H1 color="red">Job Info</H1>
          </TitleWrapper>
        </Center>
        <Loading size={30} loading={loading}>
          <List>
            <ListItem>
              <ListItemIcon>
                <PostAddIcon />
              </ListItemIcon>
              <ListItemText primary="Position" secondary={job?.position} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LocationCityIcon />
              </ListItemIcon>
              <ListItemText primary="Company" secondary={job?.company} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText primary="Location" secondary={job?.location} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PlaylistAddCheckIcon />
              </ListItemIcon>
              <ListItemText
                primary="Requirements"
                secondary={job?.requirements}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText
                primary="Description"
                secondary={job?.description}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Contact" secondary={job?.contact} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SubjectIcon />
              </ListItemIcon>
              <ListItemText
                primary="Additional Details"
                secondary={job?.additionalDetails}
              />
            </ListItem>
          </List>
        </Loading>
      </Wrapper>
      <Wrapper>
        <Center>
          <TitleWrapper>
            <H1 color="red">Students In Process</H1>
          </TitleWrapper>
        </Center>
        <br />
        <Loading loading={loading} size={30}>
          {eventsToMap.map((event: IEvent) => (
            <Accordion key={event.Student?.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-label="Expand"
                aria-controls="additional-actions2-content"
                id="additional-actions2-header"
              >
                <PersonIcon />
                <Typography className={classes.heading}>
                  {event.Student?.firstName} {event.Student?.lastName}
                </Typography>
                <Typography className={classes.iconButton}>
                  <IconButton
                    onClick={(
                      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ) => removeStudents(event.Student!.id!, e)}
                    style={{ padding: 0 }}
                  >
                    <RemoveJobButton />
                  </IconButton>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Name"
                      secondary={
                        event.Student?.firstName + " " + event.Student?.lastName
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={event.Student?.email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phone Number"
                      secondary={event.Student?.phone}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DialpadIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="ID Number"
                      secondary={event.Student?.idNumber}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <ClassIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Course"
                      secondary={event.Student?.Class.id}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DateRangeIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Age"
                      secondary={event.Student?.age}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BusinessIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Address"
                      secondary={event.Student?.address}
                    />
                  </ListItem>
                  {event.Student?.additionalDetails && (
                    <ListItem>
                      <ListItemIcon>
                        <SubjectIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Additional Details"
                        secondary={event.Student?.additionalDetails}
                      />
                    </ListItem>
                  )}
                </List>
                <EventLog
                  events={
                    job?.Events.filter(
                      (ev: IEvent) => ev.Student!.id === event.Student!.id
                    )!
                  }
                />
                <NewEventModal
                  get={getJob}
                  studentId={event.Student!.id!}
                  jobId={job?.id!}
                />
              </AccordionDetails>
            </Accordion>
          ))}
          <br />
          <Center>
            <ApplyForJobModal
              currentStudents={job?.Events.map(
                (event: IEvent) => event.Student!.id
              )}
              jobId={job?.id}
              getJob={getJob}
            />
          </Center>
        </Loading>
      </Wrapper>
    </>
  );
}

export default SingleJob;
