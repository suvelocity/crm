import React, { useCallback, useEffect, useState } from "react";
import {
  H1,
  Wrapper,
  TitleWrapper,
  Center,
  RemoveJobButton,
  GridDiv,
} from "../../styles/styledComponents";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { useParams } from "react-router-dom";
import network from "../../helpers/network";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { IStudent, IJob, IEvent } from "../../typescript/interfaces";
import EventLog from "../EventLog";
import styled from "styled-components";
import NewEventModal from "../NewEventModal";

function SingleProcess() {
  const [student, setStudent] = useState<IStudent>();
  const [job, setJob] = useState<IJob>();
  const [loading, setLoading] = useState<boolean>(true);
  const { studentId, jobId } = useParams();

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
        setLoading(false);
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, []);

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
          <Wrapper padding="30px 10px 10px 5px" backgroundColor="#e9f2f7">
            <Center>
              <h2 style={{ margin: 5 }}>Student</h2>
              <GridDiv>
                <List dense>
                  <CenteredListItem>
                    <ListItemText
                      primary="Name"
                      secondary={`${student?.firstName} ${student?.lastName}`}
                    />
                  </CenteredListItem>
                  <CenteredListItem>
                    <ListItemText
                      primary="Email"
                      secondary={`${student?.email}`}
                    />
                  </CenteredListItem>
                  <CenteredListItem>
                    <ListItemText
                      primary="Course"
                      secondary={`${student?.Class.course}`}
                    />
                  </CenteredListItem>
                </List>
                <List dense>
                  <CenteredListItem>
                    <ListItemText
                      primary="Class"
                      secondary={`${student?.Class.name}`}
                    />
                  </CenteredListItem>
                  <CenteredListItem>
                    <ListItemText
                      primary="Phone"
                      secondary={`${student?.phone}`}
                    />
                  </CenteredListItem>
                </List>
              </GridDiv>
            </Center>
          </Wrapper>
          <Wrapper padding="30px 10px 10px 5px" backgroundColor="#e9f2f7">
            <Center>
              <h2 style={{ margin: 5 }}>Job</h2>
              <GridDiv>
                <List dense>
                  <CenteredListItem>
                    <ListItemText
                      primary="Position"
                      secondary={`${job?.position}`}
                    />
                  </CenteredListItem>
                  <CenteredListItem>
                    <ListItemText
                      primary="Company"
                      secondary={`${job?.company}`}
                    />
                  </CenteredListItem>
                  <CenteredListItem>
                    <ListItemText
                      primary="Requirements"
                      secondary={`${job?.requirements}`}
                    />
                  </CenteredListItem>
                </List>
                <List>
                  <CenteredListItem>
                    <ListItemText
                      primary="Location"
                      secondary={`${job?.location}`}
                    />
                  </CenteredListItem>
                  <CenteredListItem>
                    <ListItemText
                      primary="Contact"
                      secondary={`${job?.contact}`}
                    />
                  </CenteredListItem>
                </List>
              </GridDiv>
            </Center>
          </Wrapper>
          <div style={{ gridColumn: "span 2", height: "auto" }}>
            {job?.id && student?.id && (
              <EventLog
                events={
                  student?.Events.filter(
                    (event: IEvent) => job!.id === event.Job!.id
                  )!
                }
              />
            )}
          </div>
        </GridDiv>
      </Loading>
      <NewEventModal studentId={studentId} jobId={jobId} get={() => null} />
      {/* need to figure out how to refresh data after new event is added + fix button position */}
    </Wrapper>
  );
}

const CenteredListItem = styled(ListItem)`
  text-align: center;
`;

export default SingleProcess;
