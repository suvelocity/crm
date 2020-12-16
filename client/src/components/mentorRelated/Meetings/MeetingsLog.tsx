import React, { useCallback } from "react";
import { AxiosResponse } from "axios";
import { IMeeting } from "../../../typescript/interfaces";
import {
  TimelineItem,
  TimelineDot,
  TimelineOppositeContent,
  TimelineContent,
  Timeline,
  TimelineSeparator,
  TimelineConnector,
} from "@material-ui/lab";
import { capitalize, formatToIsraeliDate } from "../../../helpers";
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
import DeleteIcon from "@material-ui/icons/Delete";
import Swal from "sweetalert2";
import network from "../../../helpers/network";

function MeetingsLog({
meeting
}: {
meeting: IMeeting[];
}) {
  const classes = useStyles();

  // const deleteEvent = async (eventId: number) => {
  //   try {
  //     await network.patch("/api/v1/event/delete", { eventId });
  //     Swal.fire("Success!", "", "success");
  //   } catch (error) {
  //     Swal.fire("Error Occurred", error.message, "error");
  //   }
  // };

  // const promptDeleteModal: (eventId: number) => void = (eventId: number) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "Deleting an event is ireversible!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Delete",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       deleteEvent(eventId).then((_) => remove(eventId));
  //     }
  //   });
  // };

  return (
    <Timeline align="alternate">
      {meeting.map((meet: IMeeting, i: number) => (
        <TimelineItem className={classes.timellineItem}>
          <TimelineOppositeContent>
            <DateStamp>{formatToIsraeliDate(meet.date)}</DateStamp>
          </TimelineOppositeContent>
          <TimelineSeparator>
            {/* <TimelineDot
              color={i !== arr.length - 1 ? "grey" : "primary"}
              variant={i !== arr.length - 1 ? "outlined" : undefined}
            >
              {i === arr.length - 1 ? <UpdateIcon /> : <CheckCircleOutline />}
            </TimelineDot> */}
            {/* {i !== arr.length - 1 && <TimelineConnector />} */}
          </TimelineSeparator>
          <TimelineContent>
            <Paper className={classes.ticket}>
              {/* <TicketHeader>{capitalize(event.eventName)}</TicketHeader>
              <Typography>{capitalize(event.entry?.comment)}</Typography> */}
              <DeleteIcon />
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
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
  margin-bottom: 10px;
`;
