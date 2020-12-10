import React from "react";
import { IEvent } from "../../typescript/interfaces";
import {
  TimelineItem,
  TimelineDot,
  TimelineOppositeContent,
  TimelineContent,
  Timeline,
  TimelineSeparator,
  TimelineConnector,
} from "@material-ui/lab";
import { capitalize, formatToIsraeliDate } from "../../helpers";
import {
  Theme,
  createStyles,
  makeStyles,
  Typography,
  Paper,
} from "@material-ui/core";
import styled from "styled-components";
import UpdateIcon from "@material-ui/icons/Update";
import { CheckCircleOutline } from "@material-ui/icons";

function EventsLog({ events }: { events: IEvent[] }) {
  const classes = useStyles();
  return (
    <Timeline align='alternate'>
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
          <TimelineContent>
            <Paper className={classes.ticket}>
              <TicketHeader>{capitalize(event.status)}</TicketHeader>
              <Typography>{capitalize(event.comment)}</Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

export default EventsLog;

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
  margin-bottom: 10px;
`;
