import React from "react";
import { IEvent } from "../typescript/interfaces";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
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
import { formatToIsraeliDate } from "../helpers/general";

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
    },
  })
);

const TicketHeader = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;

const DateStamp = styled.span`
  font-size: 0.6em;
  color: rgb(190, 190, 190);
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

  console.log(events);
  return (
    <Timeline align="alternate">
      {events.map((event: IEvent, i: number, arr) => (
        <TimelineItem className={classes.timellineItem}>
          {/* <TimelineOppositeContent>
              {event.date.slice(0, 10).replace(/-/g, "/")}
            </TimelineOppositeContent> */}
          <TimelineSeparator>
            <TimelineDot
              color={i !== arr.length - 1 ? "grey" : "primary"}
              variant={i !== arr.length - 1 ? "outlined" : undefined}
            >
              {i === arr.length - 1 ? <UpdateIcon /> : <CheckCircleOutline />}
            </TimelineDot>
            {i !== arr.length - 1 && <TimelineConnector />}
          </TimelineSeparator>

          <TimelineContent>
            <Paper className={classes.ticket}>
              <TicketHeader>{event.status}</TicketHeader>
              <Typography>{event.comment}</Typography>
              <DateStamp>{formatToIsraeliDate(event.date)}</DateStamp>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

// export default WithGoBack(EventsLog);
export default EventsLog;
