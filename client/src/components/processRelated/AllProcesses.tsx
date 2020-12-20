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
import TimelineIcon from "@material-ui/icons/Timeline";
import { IEvent } from "../../typescript/interfaces";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { capitalize, formatToIsraeliDate } from "../../helpers/general";
import { Button, TextField } from "@material-ui/core";
import PDFLink from "./PDFLink";

function AllProcesses() {
  const [processes, setProcesses] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredProcesses, setFilteredProcesses] = useState<IEvent[]>([]);
  const [filterInput, setFilterInput] = useState<string>("");
  const [click, setClick] = useState<boolean>(false);

  const handleFilter = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    const input = e.target.value;
    setClick(false);
    setFilterInput(input);

    const newProcessesArr = [];
    for (let process of processes) {
      let bool = false;
      const arrOfProcessesValue = [
        `${process.Student!.firstName} ${process.Student!.lastName}`,
        process.Job!.position,
        process.eventName,
        process.Student!.Class.name,
        process.Student!.Class.course,
        formatToIsraeliDate(process.date),
      ];
      for (let value of arrOfProcessesValue) {
        if (
          typeof value === "string" &&
          value.toLowerCase().includes(input.toLowerCase())
        ) {
          bool = true;
        }
      }
      if (bool) {
        newProcessesArr.push(process);
      }
    }
    setFilteredProcesses(newProcessesArr);
  };

  useEffect(() => {
    (async () => {
      const { data } = await network.get("/api/v1/event/allProcesses");
      setProcesses(data);
      setFilteredProcesses(data);
      setLoading(false);
    })();
  }, []);

  return (
    <Wrapper width="80%">
      <Center>
        <TitleWrapper>
          <H1 color="#cf8f18">All Processes</H1>
        </TitleWrapper>
      </Center>
      <br />
      <Center>
        <TextField
          variant="outlined"
          value={filterInput}
          label="Search process"
          onChange={(e) => handleFilter(e)}
        />
      </Center>
      {/* <Button variant='outlined' onClick={() => setClick((prev) => !prev)}>
        Prepare PDF
      </Button>
      {click && <PDFLink data={filteredProcesses} />} */}
      <br />
      <Loading loading={loading} size={30}>
        <StyledUl>
          {filteredProcesses && (
            <li>
              <TableHeader repeatFormula="0.5fr 1.5fr 1.8fr 1.5fr 1.8fr 1.25fr">
                <TimelineIcon />
                <StyledSpan weight="bold">Student</StyledSpan>
                <StyledSpan weight="bold">Class</StyledSpan>
                <StyledSpan weight="bold">Job</StyledSpan>
                <StyledSpan weight="bold">Status</StyledSpan>
                <StyledSpan weight="bold">Date</StyledSpan>
              </TableHeader>
            </li>
          )}
          {filteredProcesses &&
            filteredProcesses.map((process) => (
              <li>
                <StyledLink
                  to={`/process/${process.Student!.id}/${process.Job!.id}`}
                  color="black"
                >
                  <StyledDiv repeatFormula="0.5fr 1.5fr 1.8fr 1.5fr 1.8fr 1.25fr">
                    <TimelineIcon />
                    <StyledSpan weight="bold">
                      {capitalize(process.Student!.firstName)}{" "}
                      {capitalize(process.Student!.lastName)}
                    </StyledSpan>
                    <StyledSpan>{`${capitalize(
                      process.Student!.Class.name
                    )} (${capitalize(process.Student!.Class.course)} - ${
                      process.Student!.Class.cycleNumber
                    })`}</StyledSpan>
                    <StyledSpan>{capitalize(process.Job!.position)}</StyledSpan>
                    <StyledSpan>{process.eventName}</StyledSpan>
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
