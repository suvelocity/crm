import React, { useCallback, useEffect, useState } from "react";
import {
  H1,
  Wrapper,
  TitleWrapper,
  Center,
  RemoveJobButton,
  GridDiv,
  MultilineListItem,
} from "../../styles/styledComponents";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { useParams } from "react-router-dom";
import network from "../../helpers/network";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { IStudent, IJob, IEvent } from "../../typescript/interfaces";
import EventLog from "./EventLog";
import styled from "styled-components";
import NewEventModal from "./NewEventModal";
import { createStyles, makeStyles, Paper, Theme } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import WorkIcon from "@material-ui/icons/Work";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    primary: {
      fontWeight: "bold",
      fontSize: "1.1em",
    },
  })
);

function SingleProcess() {
  const [student, setStudent] = useState<IStudent>();
  const [job, setJob] = useState<IJob>();
  const [events, setEvents] = useState<IEvent[] | undefined>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { studentId, jobId } = useParams();
  const classes = useStyles();

  useEffect(() => {
    (async () => {
      try {
        const { data: studentData } = await network.get(
          `/api/v1/student/byId/${studentId}`
        );
        setStudent(studentData);
        const { data: jobData } = await network.get(
          `/api/v1/job/byId/${jobId}`
        );
        setJob(jobData);
        const filteredEvents = studentData?.Events.filter(
          (event: IEvent) => event.Job?.id === jobData.id
        ).sort(sortByDate);
        setEvents(filteredEvents);
        setLoading(false);
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, []);

  const addEventToLog: (newEvent: IEvent) => void = (newEvent: IEvent) => {
    const sortedEvents = events?.concat(newEvent).sort(sortByDate);
    setEvents(sortedEvents);
  };

  return (
    <Wrapper width="90%">
      <Center>
        <TitleWrapper>
          <H1>Process Time Line</H1>
        </TitleWrapper>
      </Center>
      <br />
      <Loading loading={loading} size={30}>
        <GridDiv>
          <Wrapper padding="10px" backgroundColor="#fafafa">
            <PersonIcon
              style={{
                position: "absolute",
                backgroundColor: "#3f51b5",
                color: "white",
                borderRadius: "50%",
                padding: "8px",
                fontSize: "3em",
                transform: "translate(-25px,-25px)",
              }}
            />
            <Center>
              <h2
                style={{
                  margin: "5px auto",
                  backgroundColor: "#3f51b5",
                  borderRadius: "15px",
                  color: "white",
                  width: "fit-content",
                  padding: "5px 20px",
                }}
              >
                Student
              </h2>
              <GridDiv>
                <List dense>
                  <CenteredListItem>
                    <ListItemText
                      classes={{ primary: classes.primary }}
                      primary="Name"
                      secondary={`${student?.firstName} ${student?.lastName}`}
                    />
                  </CenteredListItem>
                  <CenteredListItem>
                    <ListItemText
                      classes={{ primary: classes.primary }}
                      primary="Email"
                      secondary={`${student?.email}`}
                    />
                  </CenteredListItem>
                </List>
                <List dense>
                  <CenteredListItem>
                    <ListItemText
                      classes={{ primary: classes.primary }}
                      primary="Class"
                      secondary={`${student?.Class.name}`}
                    />
                  </CenteredListItem>
                  <CenteredListItem>
                    <ListItemText
                      classes={{ primary: classes.primary }}
                      primary="Phone"
                      secondary={`${student?.phone}`}
                    />
                  </CenteredListItem>
                </List>
              </GridDiv>
              <ListItemText
                classes={{ primary: classes.primary }}
                primary="Course"
                secondary={`${student?.Class.course}`}
              />
            </Center>
          </Wrapper>
          <Wrapper padding="10px" backgroundColor="#fafafa">
            <WorkIcon
              style={{
                position: "absolute",
                backgroundColor: "#3f51b5",
                color: "white",
                borderRadius: "50%",
                padding: "8px",
                fontSize: "3em",
                transform: "translate(-25px,-25px)",
              }}
            />
            <Center>
              <h2
                style={{
                  margin: "5px auto",
                  backgroundColor: "#3f51b5",
                  borderRadius: "15px",
                  color: "white",
                  width: "fit-content",
                  padding: "5px 20px",
                }}
              >
                Job
              </h2>
              <GridDiv>
                <List dense>
                  <CenteredListItem>
                    <ListItemText
                      classes={{ primary: classes.primary }}
                      primary="Position"
                      secondary={`${job?.position}`}
                    />
                  </CenteredListItem>
                  <CenteredListItem>
                    <ListItemText
                      classes={{ primary: classes.primary }}
                      primary="Company"
                      secondary={`${job?.company}`}
                    />
                  </CenteredListItem>
                </List>
                <List dense>
                  <CenteredListItem>
                    <ListItemText
                      classes={{ primary: classes.primary }}
                      primary="Location"
                      secondary={`${job?.location}`}
                    />
                  </CenteredListItem>
                  <CenteredListItem>
                    <ListItemText
                      classes={{ primary: classes.primary }}
                      primary="Contact"
                      secondary={`${job?.contact}`}
                    />
                  </CenteredListItem>
                </List>
              </GridDiv>
            </Center>
            <MultilineListItem>
              <ListItemText
                style={{ width: "95%", margin: "0 auto" }}
                classes={{ primary: classes.primary }}
                primary="Requirements"
                secondary={`${job?.requirements}`}
              />
            </MultilineListItem>
          </Wrapper>
          <div style={{ gridColumn: "span 2", height: "auto" }}>
            {job?.id && student?.id && events && <EventLog events={events} />}
          </div>
        </GridDiv>
      </Loading>
      <NewEventModal studentId={studentId} jobId={jobId} add={addEventToLog} />

      {/* need to figure out how to refresh data after new event is added + fix button position */}
    </Wrapper>
  );
}

const CenteredListItem = styled(ListItem)`
  text-align: center;
`;

function sortByDate(event1: IEvent, event2: IEvent) {
  // helper function to sort events by date
  return new Date(event1.date).getTime() - new Date(event2.date).getTime();
}

export default SingleProcess;
