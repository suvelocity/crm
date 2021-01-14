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
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import PersonIcon from "@material-ui/icons/Person";
import {
  IStudent,
  IEvent,
  IAcademicBackground,
  filterStudentObject,
  SelectInputs,
} from "../../typescript/interfaces";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { formatPhone } from "../../helpers/general";
import { FiltersComponents } from "../FiltersComponents";
import { capitalize, onTheSameDay } from "../../helpers/general";


const getGradeAverage = (academicBackgrounds:IAcademicBackground[]): string | number => {
  let gradeSum = 0;
  let length = 0;
  academicBackgrounds.forEach((academicBackground: IAcademicBackground) => {
    gradeSum += academicBackground.averageScore;
    length++;
  });
  if(length === 0) return "none";
  return Math.round(gradeSum / length)
}
function AllStudents() {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [addressName, setAddressName] = useState<string>();
  let timer:any;
  const [filteredStudents, setFilteredStudents] = useState<IStudent[]>([]);
  const [unsortedStudents, setUnsortedStudents] = useState<IStudent[]>([]);
  const [filterOptionsArray, setFilterOptionsArray] = useState<SelectInputs[]>(
    []
  );
  const [filterAttributes, setFilterAttributes] = useState<filterStudentObject>(
    {
      Class: [""],
      Course: [""],
      JobStatus: [""],
      Name: [""],
      Languages: [""],
      AverageScore: "רגיל"
    }
  );
  const getRecentJobsStatus = (events: IEvent[]): string[] => {
    type JobEvents = { [id: string]: { time: number; status: string } };
    let jobs: JobEvents = {};
    const filteredEvents = events.filter((event) => event.type === "jobs");
    for (let i = 0; i < filteredEvents.length; i++) {
      const id: number = filteredEvents[i].Job!.id!;
      const eventTime = new Date(filteredEvents[i].date);
      if (!jobs[`job${id}`]) {
        jobs[`job${id}`] = {
          time: eventTime.getTime(),
          status: filteredEvents[i].eventName,
        };
      } else if (
        eventTime.getTime() > jobs[`job${id}`].time ||
        onTheSameDay(jobs[`job${id}`].time, eventTime.getTime())
      ) {
        jobs[`job${id}`] = {
          time: eventTime.getTime(),
          status: events[i].eventName,
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
          filterBy: "JobStatus",
          possibleValues: newJobStatuses,
        },
        {
          filterBy: "Name",
          possibleValues: newFullNames,
        },
        {
          filterBy: "Languages",
          possibleValues: ["עברית","אנגלית","ספרדית","רוסית","ערבית"],
        },
        {
          filterBy: "AverageScore",
          singleOption: true,
          possibleValues: ["עולה", "יורד"],
        }
      ]);
      setUnsortedStudents(data.slice());
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
    const ScoreSort = filterAttributes.AverageScore;
    let studentsToFilter;
    if(ScoreSort){
      if(ScoreSort === "רגיל") {
        studentsToFilter = unsortedStudents;
      }else{
        studentsToFilter = students.sort((a:IStudent,b:IStudent) => {
          if(a.AcademicBackgrounds.length === 0){
            return 1
          }else if(b.AcademicBackgrounds.length === 0){
            return -1
          }else{
            if(ScoreSort === "עולה"){
              return  Number(getGradeAverage(b.AcademicBackgrounds)) - Number(getGradeAverage(a.AcademicBackgrounds))
            }
            return  Number(getGradeAverage(a.AcademicBackgrounds)) - Number(getGradeAverage(b.AcademicBackgrounds))
          }
        })
      }
    }else{
      studentsToFilter = unsortedStudents;
    }
    return studentsToFilter.filter((student) => {
      const addressCondition = addressName ? student.address.toLowerCase().includes(addressName) : true;
      const languageCondition = 
      filterAttributes.Languages ? 
      student.languages ? 
      filterAttributes.Languages.every((lang:string) =>!student.languages? false :student.languages.includes(lang))
      : false : false;
      const classCondition =
        filterAttributes.Class!.length === 1 &&
        filterAttributes.Class![0] === ""
          ? true
          : filterAttributes.Class!.includes(student.Class.name);
      const courseCondition =
        filterAttributes.Course!.length === 1 &&
        filterAttributes.Course![0] === ""
          ? true
          : filterAttributes.Course!.includes(student.Class.course);
      const recentJobStatus = getRecentJobsStatus(student.Events);
      const jobless =
        recentJobStatus.length === 0 ||
        recentJobStatus.every((status) => status === "Rejected");
      const jobStatusCondition =
        filterAttributes.JobStatus!.length === 1 &&
        filterAttributes.JobStatus![0] === ""
          ? true
          : (filterAttributes.JobStatus!.includes("None") && jobless) ||
            filterAttributes.JobStatus!.find((status) =>
              recentJobStatus.includes(status)
            );
      const fullNames = filterAttributes.Name!.map((fullname) =>
        fullname.split(" ").filter((name) => name != "")
      );
      const firstAndLastNamesMatch = fullNames.find((fullname) => {
        const firstName = fullname[0];
        const lastName = fullname[1];
        const firstNameCondition =
          !firstName && fullNames.length === 1
            ? true
            : student.firstName.trim() === firstName;
        const lastNameCondition =
          !lastName && fullNames.length === 1
            ? true
            : student.lastName.trim() === lastName;
        return firstNameCondition && lastNameCondition;
      });

      return (
        classCondition &&
        courseCondition &&
        firstAndLastNamesMatch &&
        jobStatusCondition &&
        addressCondition &&
        languageCondition
      );
    });
  }, [filterAttributes, addressName]);
  useEffect(() => {
    setFilteredStudents(filterFunc());
  }, [filterAttributes, addressName]);

  return (
    <Wrapper width="80%">
      <Center>
        <TitleWrapper>
          <H1>All Students</H1>
        </TitleWrapper>
        <br />
        <div style={{ display: "flex", marginBottom: "40px"}}>
          <FiltersComponents
            array={filterOptionsArray}
            filterObject={filterAttributes}
            callbackFunction={setFilterAttributes}
            widthPercent={88}
          />
          <div style={{width:"10%"}}>
            <TextField
            onKeyDown={(e) => {
              clearTimeout(timer);
              }}
            onKeyUp={(e) => {
                const t = e.target as any;
                timer = setTimeout(() =>setAddressName(t.value ? t.value.toLowerCase() : ""),100)
                }}
            label="עיר מגורים"/>
          </div>
        </div>
        <div style={{ marginTop: "40px"}}>
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
              <TableHeader repeatFormula="0.8fr 1.2fr 1fr 1.2fr 1fr 1fr 0.5fr">
                <StyledSpan weight="bold">Name</StyledSpan>
                <StyledSpan weight="bold">Class</StyledSpan>
                <StyledSpan weight="bold">Address</StyledSpan>
                <StyledSpan weight="bold">Email</StyledSpan>
                <StyledSpan weight="bold">Phone</StyledSpan>
                <StyledSpan weight="bold">Language</StyledSpan>
                <StyledSpan weight="bold">Grade Avg.</StyledSpan>
              </TableHeader>
            </li>
          )}
          {filteredStudents &&
            filteredStudents.map((student) => (
              <li>
                <StyledLink color="black" to={`/student/${student?.id}`}>
                  <StyledDiv repeatFormula="0.8fr 1.2fr 1fr 1.2fr 1fr 1fr 0.5fr">
                    <StyledSpan weight="bold">
                      {capitalize(student.firstName)}&nbsp;
                      {capitalize(student.lastName)}
                    </StyledSpan>
                    <StyledSpan>{`${capitalize(
                      student?.Class.name
                    )} (${capitalize(student?.Class.course)} - ${
                      student?.Class.cycleNumber
                    })`}</StyledSpan>
                    <StyledSpan>{student.address}</StyledSpan>
                    <StyledSpan>{student.email}</StyledSpan>
                    <StyledSpan>{formatPhone(student.phone)}</StyledSpan>
                    <StyledSpan>{student.languages}</StyledSpan>
                  <StyledSpan>{getGradeAverage(student.AcademicBackgrounds || [])}</StyledSpan>
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
