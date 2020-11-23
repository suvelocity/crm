import React from "react";
import { IEvent } from "../typescript/interfaces";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import { Theme, createStyles, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    timellineItem: {
      //   background: "red",
      minHeight: "45px",
      width: "100%",
      fontSize: "0.8em",
      padding: 0,
    },
  })
);

function EventsLog({ events }: { events: IEvent[] }) {
  const classes = useStyles();
  return (
    <>
      <Timeline>
        {events.map((event: IEvent, i: number, arr) => (
          <TimelineItem className={classes.timellineItem}>
            <TimelineOppositeContent>
              {event.createdAt.slice(0, 10).replace(/-/g, "/")}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot
                color={i !== arr.length - 1 ? "grey" : "primary"}
                variant={i !== arr.length - 1 ? "outlined" : undefined}
              />
              {i !== arr.length - 1 && <TimelineConnector />}
            </TimelineSeparator>

            {i === arr.length - 1 ? (
              <TimelineContent>
                <b> {event.status}</b>
              </TimelineContent>
            ) : (
              <TimelineContent>{event.status}</TimelineContent>
            )}
          </TimelineItem>
        ))}
      </Timeline>
    </>
  );
}

export default EventsLog;
