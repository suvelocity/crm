import React, { useEffect, useState, useCallback } from "react";
import {
  H1,
  Wrapper,
  TitleWrapper,
  Center,
  GridDiv,
} from "../../../styles/styledComponents";
import List from "@material-ui/core/List";
import { useParams } from "react-router-dom";
import network from "../../../helpers/network";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { IPairMeetings } from "../../../typescript/interfaces";
import styled from "styled-components";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import WorkIcon from "@material-ui/icons/Work";
import { SingleCenteredListItem } from "../../tableRelated";
import Swal from "sweetalert2";
import MeetingsLog from "./MeetingsLog";
import NewMeetingModal from "./NewMeetingModal";
import EndMeetingModal from "./EndMeetingModal";

function PairMeetings() {
  const [meetings, setMeetings] = useState<IPairMeetings>();
  const [loading, setLoading] = useState<boolean>(true);
  const classes = useStyles();
  const { id } = useParams();

  const getMeetings = useCallback(async () => {
    try {
      const { data }: { data: IPairMeetings } = await network.get(
        `/api/V1/M/meeting/${id}`
      );    
      setMeetings(data);
      setLoading(false);
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
  }, []);

  useEffect(() => {
    getMeetings();
  }, []);

  const classesType = { primary: classes.primary };

  return (
    <Wrapper width="90%">
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
                    secondary={`${meetings?.Student.firstName} ${meetings?.Student.lastName}`}
                  />
                  <SingleCenteredListItem
                    classes={classesType}
                    primary="Email"
                    secondary={`${meetings?.Student.email}`}
                  />
                </List>
                <List dense>
                  <SingleCenteredListItem
                    classes={classesType}
                    primary="Phone"
                    secondary={`${meetings?.Student.phone}`}
                  />
                </List>
              </GridDiv>
            </Center>
          </Wrapper>
          <Wrapper padding="10px" backgroundColor="#fafafa">
            <PersonIcon style={personIconStyle} />
            <Center>
              <H2>Mentor</H2>
              <GridDiv>
                <List dense>
                  <SingleCenteredListItem
                    classes={classesType}
                    primary="Name"
                    secondary={`${meetings?.Mentor.name}`}
                  />
                  <SingleCenteredListItem
                    classes={classesType}
                    primary="Email"
                    secondary={`${meetings?.Mentor.email}`}
                  />
                </List>
                <List dense>
                  <SingleCenteredListItem
                    classes={classesType}
                    primary="Phone"
                    secondary={`${meetings?.Mentor.phone}`}
                  />
                </List>
              </GridDiv>
            </Center>
          </Wrapper>
          <br/>
          <br/>
          <br/>
          <div style={{ gridColumn: "span 2", height: "auto" }}>
          <Center>
            <TitleWrapper>
              <H1 color="#c47dfa">Meetings</H1>
            </TitleWrapper>
          </Center>
            {meetings?.Meetings && <MeetingsLog meeting={meetings.Meetings} getMeetings={getMeetings} />}
          </div>
        </GridDiv>
      </Loading>
      <Center>
      <NewMeetingModal id={id} getMeetings={getMeetings}  />
      </Center>
    </Wrapper>
  );
}

export default PairMeetings;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    primary: {
      fontWeight: "bold",
      fontSize: "1.1em",
    },
  })
);

const personIconStyle: any = {
  position: "absolute",
  backgroundColor: "#c47dfa",
  color: "white",
  borderRadius: "50%",
  padding: "8px",
  fontSize: "3em",
  transform: "translate(-25px,-25px)",
};

const workIconStyle: any = {
  position: "absolute",
  backgroundColor: "#c47dfa",
  color: "white",
  borderRadius: "50%",
  padding: "8px",
  fontSize: "3em",
  transform: "translate(-25px,-25px)",
};

const H2 = styled.h2`
  margin: 5px auto;
  background-color: "#c47dfa";
  border-radius: 15px;
  color: black;
  width: fit-content;
  padding: 5px 20px;
`;
