import React from "react";
import { IEvent } from "../typescript-utils/interfaces";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineOpositeContent from "@material-ui/lab/TimelineOppositeContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import { Theme, createStyles, makeStyles, Typography } from "@material-ui/core";

const dummyEvents: IEvent[] = [
  {
    id: "1",
    studentId: "Nitzan",
    jobId: "aaa",
    type: "CV sent",
    date: new Date("2020-10-11"),
  },
  {
    id: "2",
    studentId: "Nitzan",
    jobId: "aaa",
    type: "First interview",
    date: new Date("2020-10-13"),
  },
  {
    id: "3",
    studentId: "Nitzan",
    jobId: "aaa",
    type: "Second Interview",
    date: new Date("2020-10-19"),
  },
  {
    id: "4",
    studentId: "Nitzan",
    jobId: "aaa",
    type: "Hired",
    date: new Date("2020-10-19"),
  },
  {
    id: "5",
    studentId: "Shahar",
    jobId: "aaa",
    type: "CV sent",
    date: new Date("2020-10-23"),
  },
  {
    id: "6",
    studentId: "Shahar",
    jobId: "aaa",
    type: "Rejected",
    date: new Date("2020-10-25"),
  },
];

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
// function EventsLog({ events }: { events: IEvent[] }) {
function EventsLog() {
  const classes = useStyles();
  return (
    <>
      <Timeline>
        {dummyEvents.map((event: IEvent, i: number, arr) => (
          <TimelineItem
            // style={{
            //   backgroundColor: "red",
            //   minHeight: "20px",
            //   width: "50px",
            // }}
            className={classes.timellineItem}
          >
            <TimelineOpositeContent>
              {event.date.toISOString().slice(0, 10).replace(/-/g, "/")}
            </TimelineOpositeContent>
            <TimelineSeparator>
              <TimelineDot
                color={i !== arr.length - 1 ? "grey" : "primary"}
                variant={i !== arr.length - 1 ? "outlined" : undefined}
              />
              {i !== arr.length - 1 && <TimelineConnector />}
            </TimelineSeparator>

            {i === arr.length - 1 ? (
              <TimelineContent>
                <b> {event.type}</b>
              </TimelineContent>
            ) : (
              <TimelineContent>{event.type}</TimelineContent>
            )}
          </TimelineItem>
        ))}
      </Timeline>
    </>
  );
}

export default EventsLog;
