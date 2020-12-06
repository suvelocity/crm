import React from "react";
import { IEvent } from "../../typescript/interfaces";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import { capitalize } from "../../helpers/general";
import {
  Theme,
  createStyles,
  makeStyles,
  Typography,
  Paper,
} from "@material-ui/core";
import styled from "styled-components";
// import WithGoBack from "./hoc/WithGoBack";
import UpdateIcon from "@material-ui/icons/Update";
import { CheckCircleOutline } from "@material-ui/icons";
import { formatToIsraeliDate } from "../../helpers/general";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    timellineItem: {
      //   background: "red",
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

const TicketHeader = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;

const DateStamp = styled.span`
  /* background-color: #3f51b5; */
  font-size: 0.5em;
  /* color: white; */
  /* margin-bottom: 10px; */
  /* position: absolute;
  left: 40%; */
  padding: 8px;
  border-radius: 15px;
  box-shadow: -2px 2px 4px rgba(10, 10, 15, 0.3);
`;
// function EventsLog({
//   events,
//   goBackBtn,
// }: {
//   events: IEvent[];
//   goBackBtn: HTMLButtonElement;
// }) {
function EventsLog({ events }: { events: IEvent[] }) {
  const classes = useStyles();

  return (
    <Timeline align="alternate">
      {events.map((event: IEvent, i: number, arr) => (
        <TimelineItem className={classes.timellineItem}>
          <TimelineOppositeContent>
            <DateStamp>{formatToIsraeliDate(event.date)}</DateStamp>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot
              color={i !== arr.length - 1 ? "grey" : "primary"}
              variant={i !== arr.length - 1 ? "outlined" : undefined}
            >
              {i === arr.length - 1 ? <UpdateIcon /> : <CheckCircleOutline />}
            </TimelineDot>
            {i !== arr.length - 1 && <TimelineConnector />}
          </TimelineSeparator>

          <TimelineContent
          // style={{
          //   display: "flex",
          //   flexDirection: "column",
          //   alignItems: "start",
          // }}
          >
            <Paper className={classes.ticket}>
              {/* <DateStamp>{formatToIsraeliDate(event.date)}</DateStamp> */}
              <TicketHeader>{capitalize(event.status)}</TicketHeader>
              <Typography>{capitalize(event.comment)}</Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

// export default WithGoBack(EventsLog);
export default EventsLog;
