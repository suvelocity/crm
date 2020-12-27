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
import {
  filterStudentObject,
  IEvent,
  SelectInputs,
  IFilterOptions,
} from "../../typescript/interfaces";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { capitalize, formatToIsraeliDate } from "../../helpers/general";
import { Button, TextField } from "@material-ui/core";
import PDFLink from "./PDFLink";
import { FiltersComponents } from "../FiltersComponents";

function AllProcesses() {
  const [processes, setProcesses] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredProcesses, setFilteredProcesses] = useState<IEvent[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [click, setClick] = useState<boolean>(false);
  //filters
  const [filterOptionsArray, setFilterOptionsArray] = useState<SelectInputs[]>(
    []
  );
  const [filterAttributes, setFilterAttributes] = useState<filterStudentObject>(
    {
      Class: [],
      JobStatus: [],
      Company: []
    }
  );

  const handleFilter = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    const input = e.target.value;
    setClick(false);
    setSearchInput(input);

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

  const fetchProcesses: (filter: any) => Promise<void> = async (
    filter: any
  ) => {
    const { data } = await network.get("/api/v1/event/allProcesses", {
      params: filter,
    });
    const { data: filterOptions } = await network.get(
      "/api/v1/event/process-options"
    );
    setProcesses(data);
    setFilteredProcesses(data);
    //@ts-ignore
    setFilterOptionsArray([
      {
        filterBy: "Class",
        possibleValues: filterOptions.classes
          .map((cls: { name: string; id: string }) => cls.name),
      },
      {
        filterBy: "Job Status",
        possibleValues: filterOptions.statuses,
      },
      {
        filterBy: "Company",
        possibleValues: filterOptions.companies,
      },
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchProcesses(formatFiltersToServer(filterAttributes));
  }, [filterAttributes]);

  return (
    <Wrapper width="80%">
      <Center>
        <TitleWrapper>
          <H1 color="#cf8f18">All Processes</H1>
        </TitleWrapper>
      </Center>
      <br />
      <Center>
        <div style={{ display: "flex" }}>
          <FiltersComponents
            array={filterOptionsArray}
            filterObject={filterAttributes}
            callbackFunction={setFilterAttributes}
            widthPercent={50}
          />
          <TextField
            variant="outlined"
            value={searchInput}
            label="Search process"
            onChange={(e) => handleFilter(e)}
          />
        </div>
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
              <TableHeader repeatFormula="0.5fr 1.5fr 1.8fr 1.2fr 1.5fr 1.8fr 1.25fr">
                <TimelineIcon />
                <StyledSpan weight="bold">Student</StyledSpan>
                <StyledSpan weight="bold">Class</StyledSpan>
                <StyledSpan weight="bold">Job</StyledSpan>
                <StyledSpan weight="bold">Company</StyledSpan>
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
                  <StyledDiv repeatFormula="0.5fr 1fr 1.3fr 1fr 1fr 1.3fr 1.1fr">
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
                    <StyledSpan>{capitalize(process.Job!.Company.name)}</StyledSpan>
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

function formatFiltersToServer(attrObj: filterStudentObject) {
  return {
    class: attrObj.Class![0] ? { name: attrObj.Class } : {},
    process: attrObj.JobStatus![0] ? { name: attrObj.JobStatus } : {},
    company: attrObj.Company![0] ? { name: attrObj.Company } :{}
  }
}

export default AllProcesses;
