import React, { useEffect, useState } from "react";
import {
  H1,
  Wrapper,
  TitleWrapper,
  Center,
  GridDiv,
  MultilineListItem,
} from "../../styles/styledComponents";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import { useParams } from "react-router-dom";
import network from "../../helpers/network";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { IStudent, IJob, IEvent } from "../../typescript/interfaces";
import EventLog from "./EventLog";
import styled from "styled-components";
import NewEventModal from "./NewEventModal";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import WorkIcon from "@material-ui/icons/Work";
import { SingleCenteredListItem } from "../tableRelated";
import Swal from "sweetalert2";
import { capitalize } from "../../helpers/general";

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
      } catch (error) {
        Swal.fire("Error Occurred", error.message, "error");
      }
    })();
  }, []);

  const addEventToLog: (newEvent: IEvent) => void = (newEvent: IEvent) => {
    const sortedEvents = events?.concat(newEvent).sort(sortByDate);
    setEvents(sortedEvents);
  };

  const removeFromEventLog: (eventId: number) => void = (eventId: number) => {
    const index: number | undefined = events?.findIndex(
      (event: IEvent) => event.id === eventId
    );
    if (!index) {
      Swal.fire("Error occurred", " event not found", "error");
      return;
    }
    const updated = events?.slice(0, index).concat(events.slice(index + 1));
    setEvents(updated);
  };
  const classesType = {
    primary: classes.primary,
    secondary: classes.secondary,
  };

  const classesTypeRequirements = {
    primary: classes.primaryReq,
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
            <PersonIcon style={personIconStyle} />
            <Center>
              <H2>Student</H2>
              <GridDiv>
                <List dense>
                  <SingleCenteredListItem
                    classes={classesType}
                    primary="Name"
                    secondary={`${capitalize(student?.firstName)} ${capitalize(
                      student?.lastName
                    )}`}
                  />
                  <SingleCenteredListItem
                    classes={classesType}
                    primary="Email"
                    secondary={`${student?.email}`}
                  />
                </List>
                <List dense>
                  <SingleCenteredListItem
                    classes={classesType}
                    primary="Class"
                    secondary={`${capitalize(
                      student?.Class.name
                    )} (${capitalize(student?.Class.course)} - ${
                      student?.Class.cycleNumber
                    })`}
                  />
                  <SingleCenteredListItem
                    classes={classesType}
                    primary="Phone"
                    secondary={`${student?.phone}`}
                  />
                </List>
              </GridDiv>
              <ListItemText
                classes={classesType}
                primary="Course"
                secondary={`${student?.Class.course}`}
              />
            </Center>
          </Wrapper>
          <Wrapper padding="10px" backgroundColor="#fafafa">
            <WorkIcon style={workIconStyle} />
            <Center>
              <H2>Job</H2>
              <GridDiv>
                <List dense>
                  <SingleCenteredListItem
                    classes={classesType}
                    primary="Position"
                    secondary={`${job?.position}`}
                  />
                  <SingleCenteredListItem
                    classes={classesType}
                    primary="Company"
                    secondary={`${job?.Company.name}`}
                  />
                </List>
                <List dense>
                  <SingleCenteredListItem
                    classes={classesType}
                    primary="Location"
                    secondary={`${job?.location}`}
                  />
                  <SingleCenteredListItem
                    classes={classesType}
                    primary="Contact"
                    secondary={`${job?.contact}`}
                  />
                </List>
              </GridDiv>
            </Center>
            <MultilineListItem>
              <ListItemText
                style={{ width: "95%", margin: "0 auto" }}
                classes={classesTypeRequirements}
                primary="Requirements"
                secondary={`${job?.requirements}`}
              />
            </MultilineListItem>
          </Wrapper>
          <div style={{ gridColumn: "span 2", height: "auto" }}>
            {job?.id && student?.id && events && (
              <EventLog events={events} remove={removeFromEventLog} />
            )}
          </div>
        </GridDiv>
      </Loading>
      {job?.id && student?.id && events && (
      <NewEventModal events={events} studentId={studentId} jobId={jobId} add={addEventToLog} />
      )}
    </Wrapper>
  );
}

export default SingleProcess;

function sortByDate(event1: IEvent, event2: IEvent) {
  // helper function to sort events by date
  return new Date(event1.date).getTime() - new Date(event2.date).getTime();
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    primary: {
      fontWeight: "bold",
      fontSize: "1.1em",
      textAlign: "center",
    },
    secondary: {
      textAlign: "center",
    },
    primaryReq: {
      fontWeight: "bold",
      fontSize: "1.1em",
    },
  })
);

const personIconStyle: any = {
  position: "absolute",
  backgroundColor: "#3f51b5",
  color: "white",
  borderRadius: "50%",
  padding: "8px",
  fontSize: "3em",
  transform: "translate(-25px,-25px)",
};

const workIconStyle: any = {
  position: "absolute",
  backgroundColor: "#3f51b5",
  color: "white",
  borderRadius: "50%",
  padding: "8px",
  fontSize: "3em",
  transform: "translate(-25px,-25px)",
};

const H2 = styled.h2`
  margin: 5px auto;
  background-color: #3f51b5;
  border-radius: 15px;
  color: white;
  width: fit-content;
  padding: 5px 20px;
`;
