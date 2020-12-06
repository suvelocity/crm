import React, { useState, useEffect, useCallback } from "react";
import network from "../../helpers/network";
import {
  H1,
  Wrapper,
  TitleWrapper,
  StyledLink,
  Center,
  StyledSpan,
  TableHeader,
  StyledUl,
  StyledDiv,
} from "../../styles/styledComponents";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import PersonIcon from "@material-ui/icons/Person";
import { IStudent, IClass, IEvent } from "../../typescript/interfaces";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { formatPhone } from "../../helpers/general";
import searchResults from "../../functions/searchStudents";

import { SelectInputs } from "../FiltersComponents";
import { FiltersComponents } from "../FiltersComponents";
import { capitalize } from "../../helpers/general";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightBold,
      marginLeft: 10,
      marginTop: 3,
    },
  })
);

type filterOptions = "Class" | "Course" | "JobStatus" | "Name";

export interface filterStudentObject {
  Class: string;
  Course: string;
  JobStatus: string;
  Name: string;
}
export interface Name {
  firstName: string;
  lastName: string;
}
const onTheSameDay = (day1: number, day2: number) => {
  const sameDayNumber = new Date(day1).getDate() === new Date(day2).getDate();
  const Day = 1000 * 60 * 60 * 24;
  const diffLessThanDay = Math.abs(day1 - day2) < Day;
  return sameDayNumber && diffLessThanDay;
};

function AllStudents() {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredStudents, setFilteredStudents] = useState<IStudent[]>([]);
  const [filterOptionsArray, setFilterOptionsArray] = useState<SelectInputs[]>(
    []
  );
  const [filterAttributes, setFilterAttributes] = useState<filterStudentObject>(
    {
      Class: "",
      Course: "",
      JobStatus: "",
      Name: "",
    }
  );
  const classes = useStyles();
  const getRecentJobsStatus = (events: IEvent[]): string[] => {
    type JobEvents = { [id: string]: { time: number; status: string } };
    let jobs: JobEvents = {};
    for (let i = 0; i < events.length; i++) {
      const id: number = events[i].Job!.id!;
      const eventTime = new Date(events[i].date);
      if (!jobs[`job${id}`]) {
        jobs[`job${id}`] = {
          time: eventTime.getTime(),
          status: events[i].status,
        };
      } else if (
        eventTime.getTime() > jobs[`job${id}`].time ||
        onTheSameDay(jobs[`job${id}`].time, eventTime.getTime())
      ) {
        jobs[`job${id}`] = {
          time: eventTime.getTime(),
          status: events[i].status,
        };
      }
    }
    let JobStatuses: { [status: string]: string } = {};
    for (const key in jobs) {
      if (!JobStatuses[jobs[key].status])
        JobStatuses[jobs[key].status] = jobs[key].status;
    }
    return Object.keys(JobStatuses);
  };
  useEffect(() => {
    (async () => {
      const { data } = await network.get("/api/v1/student/all");
      const newClassNames: string[] = Array.from(
        new Set(data.map((student: IStudent) => student.Class.name))
      );
      const newCourseNames: string[] = Array.from(
        new Set(data.map((student: IStudent) => student.Class.course))
      );
      let JobStatuses: string[] = [];
      data.forEach((student: IStudent) => {
        JobStatuses = [...JobStatuses, ...getRecentJobsStatus(student.Events)];
      });
      const newJobStatuses: string[] = Array.from(new Set(JobStatuses));
      const newFullNames: string[] = Array.from(
        new Set(
          data.map(
            (student: IStudent) => student.firstName + " " + student.lastName
          )
        )
      );
      setFilterOptionsArray([
        {
          filterBy: "Course",
          possibleValues: newCourseNames,
        },
        {
          filterBy: "Class",
          possibleValues: newClassNames,
        },
        {
          filterBy: "Job Status",
          possibleValues: newJobStatuses,
        },
        {
          filterBy: "Name",
          possibleValues: newFullNames,
        },
      ]);
      setStudents(data);
      setLoading(false);
    })();
  }, []);
  useEffect(() => {
    if (students) {
      setFilteredStudents(students);
    }
  }, [students]);
  const filterFunc = useCallback(() => {
    return students.filter((student) => {
      const classCondition = !filterAttributes.Class
        ? true
        : student.Class.name === filterAttributes.Class;
      const courseCondition = !filterAttributes.Course
        ? true
        : student.Class.course === filterAttributes.Course;
      const recentJobStatus = getRecentJobsStatus(student.Events);
      const jobless =
        recentJobStatus.length === 0 ||
        recentJobStatus.every((status) => status === "Rejected");
      const jobStatusCondition = !filterAttributes.JobStatus
        ? true
        : filterAttributes.JobStatus === "None"
        ? jobless
        : recentJobStatus.includes(filterAttributes.JobStatus);
      const firstName = filterAttributes.Name.split(" ")[0];
      const lastName = filterAttributes.Name.split(" ")[1];
      const firstNameCondition = !firstName
        ? true
        : student.firstName === firstName;
      const lastNameCondition = !lastName
        ? true
        : student.lastName === lastName;
      return (
        classCondition &&
        courseCondition &&
        firstNameCondition &&
        lastNameCondition &&
        jobStatusCondition
      );
    });
  }, [filterAttributes]);
  useEffect(() => {
    setFilteredStudents(filterFunc());
  }, [filterAttributes]);

  return (
    <Wrapper width="80%">
      <Center>
        <TitleWrapper>
          <H1>All Students</H1>
        </TitleWrapper>
        <br />
        <div style={{ display: "flex" }}>
          <FiltersComponents
            array={filterOptionsArray}
            filterObject={filterAttributes}
            callbackFunction={setFilterAttributes}
            widthPercent={75}
          />
          <StyledLink to="/student/add">
            <Button variant="contained" color="primary">
              Add Student
            </Button>
          </StyledLink>
        </div>
      </Center>
      <br />
      <Loading loading={loading} size={30}>
        <StyledUl>
          {students && (
            <li>
              <TableHeader>
                <PersonIcon />
                <StyledSpan weight="bold">Name</StyledSpan>
                <StyledSpan weight="bold">Class</StyledSpan>
                <StyledSpan weight="bold">Email</StyledSpan>
                <StyledSpan weight="bold">Phone</StyledSpan>
              </TableHeader>
            </li>
          )}
          {filteredStudents &&
            filteredStudents.map((student) => (
              <li>
                <StyledLink color="black" to={`/student/${student?.id}`}>
                  <StyledDiv>
                    <PersonIcon />
                    <StyledSpan weight="bold">
                      {capitalize(student.firstName)}&nbsp;
                      {capitalize(student.lastName)}
                    </StyledSpan>
                    <StyledSpan>{capitalize(student.Class.name)}</StyledSpan>
                    <StyledSpan>{student.email}</StyledSpan>
                    <StyledSpan>{formatPhone(student.phone)}</StyledSpan>
                  </StyledDiv>
                </StyledLink>
              </li>
            ))}
        </StyledUl>
      </Loading>
    </Wrapper>
  );
}

export default AllStudents;
