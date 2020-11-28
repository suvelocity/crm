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
import { IStudent, IClass } from "../../typescript/interfaces";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { formatPhone } from "../../helpers/general";
import searchResults from "../../functions/searchStudents";

import {SelectInputs} from '../FiltersComponents';
import {FiltersComponents} from "../FiltersComponents";
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
  firstName:string;
  lastName:string;
}

function AllStudents() {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredStudents, setFilteredStudents] = useState<IStudent[]>([]);
  const [filterOptionsArray, setFilterOptionsArray] = useState<SelectInputs[]>([]);
  const [filterAttributes, setFilterAttributes] = useState<filterStudentObject>({
    Class: "",
    Course: "",
    JobStatus: "",
    Name: "",
  })
  const classes = useStyles();

  useEffect(() => {
    (async () => {
      const { data } = await network.get("/api/v1/student/all");
      const newClassNames:string[] = Array.from(new Set(data.map((student: IStudent) => student.Class.name)));
      const newCourseNames:string[] = Array.from(new Set (data.map((student: IStudent) => student.Class.course)));
      const newJobStatuses:string[] = Array.from(new Set (data.map((student: IStudent) => {
        let mostRecentStatus:string = "";
        let mostRecentTime:number = 0;
        for(let i = 0; i < student.Events.length; i++){
          const eventTime = new Date(student.Events[i].date).getTime();
          if(eventTime > mostRecentTime){
            mostRecentTime = eventTime;
            mostRecentStatus = student.Events[i].status;
          }
        }
        return mostRecentStatus;
      })));
      const newFullNames:string[] = Array.from(new Set (data.map((student: IStudent) =>student.firstName + " " + student.lastName)));
      setFilterOptionsArray([
        {
          filterBy:"Class",
          possibleValues: newClassNames
        },
        {
          filterBy:"Course",
          possibleValues: newCourseNames
        },
        {
          filterBy:"JobStatus",
          possibleValues: newJobStatuses
        },
        {
          filterBy:"Name",
          possibleValues: newFullNames
        },
      ])
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
    return students.filter(student =>{
      const classCondition = !filterAttributes.Class? true : (student.Class.name === filterAttributes.Class);
      const courseCondition = !filterAttributes.Course? true : (student.Class.course === filterAttributes.Course);
      const recentEvent = student.Events[student.Events.length -1];
      const jobStatusCondition = !filterAttributes.JobStatus? true : (!recentEvent? false : recentEvent.status === filterAttributes.JobStatus);
      const firstName = filterAttributes.Name.split(" ")[0];
      const lastName = filterAttributes.Name.split(" ")[1];
      const firstNameCondition = !firstName ? true : (student.firstName === firstName);
      const lastNameCondition = !lastName ? true : (student.lastName === lastName);
      return classCondition && courseCondition && firstNameCondition && lastNameCondition && jobStatusCondition;
    })
  },[filterAttributes])
  useEffect(() => {
    setFilteredStudents(filterFunc())
  },[filterAttributes])

  return (
    <Wrapper width='80%'>
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
          widthPercent={75}/>
          <StyledLink to='/student/add'>
            <Button variant='contained' color='primary'>
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
                <StyledLink color='black' to={`/student/${student?.id}`}>
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
