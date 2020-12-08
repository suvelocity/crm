import React, { useState, useEffect } from "react";
import network from "../../helpers/network";
import {
  H1,
  Wrapper,
  TitleWrapper,
  StyledLink,
  Center,
  StyledSpan,
  StyledUl,
  TableHeader,
  StyledDiv,
} from "../../styles/styledComponents";
import Button from "@material-ui/core/Button";
import TimelineIcon from "@material-ui/icons/Timeline";
import { IEvent } from "../../typescript/interfaces";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { capitalize, formatToIsraeliDate } from "../../helpers/general";

function AllProcesses() {
  const [processes, setProcesses] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const { data } = await network.get("/api/v1/event/all");
      const sortedData = data.sort(
        (a: IEvent, b: IEvent) =>
          new Date(b.date).valueOf() - new Date(a.date).valueOf()
      );
      const processesData: IEvent[] = [];
      sortedData.forEach((event: IEvent) => {
        if (
          processesData.findIndex(
            (process: IEvent) =>
              process.Student!.id === event.Student!.id &&
              process.Job!.id === event.Job!.id
          ) === -1
        ) {
          processesData.push(event);
        }
      });
      setProcesses(processesData);
      setLoading(false);
    })();
  }, []);

  return (
    <Wrapper width="80%">
      <Center>
        <TitleWrapper>
          <H1 color="#cf8f18">All Processes</H1>
        </TitleWrapper>
        <br />
        <StyledLink to="/job/add">
          <Button
            style={{ backgroundColor: "#cf8f18", color: "white" }}
            variant="contained"
          >
            Add Job
          </Button>
        </StyledLink>
      </Center>
      <br />
      <Loading loading={loading} size={30}>
        <StyledUl>
          {processes && (
            <li>
              <TableHeader>
                <TimelineIcon />
                <StyledSpan weight="bold">Student</StyledSpan>
                <StyledSpan weight="bold">Job</StyledSpan>
                <StyledSpan weight="bold">Status</StyledSpan>
                <StyledSpan weight="bold">Date</StyledSpan>
              </TableHeader>
            </li>
          )}
          {processes &&
            processes.map((process) => (
              <li>
                <StyledLink
                  to={`/process/${process.Student!.id}/${process.Job!.id}`}
                  color="black"
                >
                  <StyledDiv>
                    <TimelineIcon />
                    <StyledSpan weight="bold">
                      {capitalize(process.Student!.firstName)}{" "}
                      {capitalize(process.Student!.lastName)}
                    </StyledSpan>
                    <StyledSpan>{capitalize(process.Job!.position)}</StyledSpan>
                    <StyledSpan>{process.status}</StyledSpan>
                    <StyledSpan>{formatToIsraeliDate(process.date)}</StyledSpan>
                  </StyledDiv>
                </StyledLink>
              </li>
            ))}
        </StyledUl>
      </Loading>
    </Wrapper>
  );
}

export default AllProcesses;
