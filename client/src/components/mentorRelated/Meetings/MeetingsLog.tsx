import React, { useCallback } from "react";
// import { AxiosResponse } from "axios";
import { IMeeting } from "../../../typescript/interfaces";
import {
  TimelineItem,
  TimelineOppositeContent,
  TimelineContent,
  Timeline,
  TimelineSeparator,
} from "@material-ui/lab";
import { capitalize, formatToIsraeliDateAndTime } from "../../../helpers";
import {
  Theme,
  createStyles,
  makeStyles,
  Typography,
  Paper,
} from "@material-ui/core";
import {
  StyledSpan,
} from "../../../styles/styledComponents";
import styled from "styled-components";
import EndMeetingModal from './EndMeetingModal'
import EditMeetingModal from './EditMeetingModal'

function MeetingsLog({
meeting,
getMeetings
}: {
meeting: IMeeting[];
getMeetings:any;
}) {
  const classes = useStyles();
  meeting.sort((a:IMeeting,b:IMeeting) => {
    return new Date(a.date!).getTime() - new Date(b.date!).getTime()
  })
  return (
    <Timeline align="alternate">
      {meeting.map((meet: IMeeting, i: number) =>{
        const color = !meet.occurred? "white" : "#cffadb";
        return (
        <TimelineItem className={classes.timellineItem}>
          <TimelineOppositeContent>
            <DateStamp>{formatToIsraeliDateAndTime(meet.date)}</DateStamp>
          </TimelineOppositeContent>
          <TimelineSeparator>
          </TimelineSeparator>
          <TimelineContent >
            <Paper className={classes.ticket} style={{backgroundColor:color}}>
              <TicketHeader>{capitalize(`Appointment - ${i+1}`)}</TicketHeader>
              <StyledSpan weight="bold">
                Title: 
              </StyledSpan>
              <StyledSpan>{` ${meet.title}`}</StyledSpan>
              <br/>
              {meet.studentFeedback&&
              <>
               <StyledSpan weight="bold">
               Student Feedback: 
             </StyledSpan>
              <StyledSpan>{` ${meet.studentFeedback}`}</StyledSpan>
              <br/>
              </>
              }
              <EditMeetingModal meeting={meet} getMeetings={getMeetings}/>
              <EndMeetingModal meeting={meet} getMeetings={getMeetings}/>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      )})}
    </Timeline>
  );
}

export default MeetingsLog;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    timellineItem: {
      minHeight: "20vh",
      width: "100%",
      fontSize: "1.8em",
      padding: 0,
    },
    ticket: {
      padding: "10px",
      minHeight: "10vh",
      background: "rgba(181,181,181,0.12)",
      textAlign: "left",
      whiteSpace: "pre-wrap",
      width: "95%",
    },
  })
);

const DateStamp = styled.span`
  font-size: 0.5em;
  padding: 8px;
  border-radius: 15px;
  box-shadow: -2px 2px 4px rgba(10, 10, 15, 0.3);
`;

const TicketHeader = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
`;
