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
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import PersonIcon from "@material-ui/icons/Person";
import {
  IStudent,
  IEvent,
  IAcademicBackground,
  filterStudentObject,
  SelectInputsV2,
  LabelIdsWithGradesPerStudent
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
  const [gradesByLabel, setGradesByLabel] = useState<LabelIdsWithGradesPerStudent>({});
  const [gradeParams, setGradeParams] = useState<{[param:string]: string[]}>({
    labelIds: [""]
  });
  const [labelOptions, setLabelOptions] = useState<{id:string, name:string}[]>([]);
  const [unsortedStudents, setUnsortedStudents] = useState<IStudent[]>([]);
  const [filterOptionsArray, setFilterOptionsArray] = useState<SelectInputsV2[]>(
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
  const getGrades = async () => {
    const studentIdArray = filteredStudents.map((student: IStudent) => student.id);
    let query = `?labelIds=[${gradeParams.labelIds}]&&studentIds=[${studentIdArray}]`;
    const {data : grades}: {data : LabelIdsWithGradesPerStudent} = await network.get(`/api/v1/student/labelIdsWithGrades`, { // /${query}
      params: gradeParams
    });
    console.log('grades', grades)
    setGradesByLabel(grades);
    setLoading(false)
  }
  useEffect(() => {
    if(gradeParams.labelIds[0] !== ""){
      if(!loading) setLoading(true)
      getGrades();
    }else{
      setLoading(false)
    }
  },[gradeParams])
  const fetchLabels = async() => {
    const {data} = await network.get('/api/v1/label/all');
    setLabelOptions(data)
  }
  useEffect(() => {
    (async () => {
      fetchLabels();
      const { data } = await network.get("/api/v1/student/all");
      const dataObj: {[key: string]: boolean} = {};
      const newClassNames : {name: string, id?: number}[]= [];
      const newCourseNames : {name: string, id?: number}[]= [];
      const newFullNames : {name: string, id?: number}[]= [];
      const newJobStatuses : {name: string}[]= [];
      // const newClassNames: {name: string, id?: number}[] = Array.from(
      //   new Set(data.map((student: IStudent) => ({ id: student.Class.id, name: student.Class.name})))
      // );
      // console.table(newClassNames)
      data.forEach((student: IStudent) => {
        if(!dataObj[`${student.Class.name}`]){
          dataObj[`${student.Class.name}`] = true;
          newClassNames.push({name:student.Class.name, id:student.Class.id});
        }
        if(!dataObj[`${student.Class.course}`]){
          dataObj[`${student.Class.course}`] = true;
          newCourseNames.push({name:student.Class.course});
        }
        newFullNames.push({ id: student.id, name: student.firstName + " " + student.lastName })
      })
      console.log(dataObj)
      let JobStatuses: string[] = [];
      data.forEach((student: IStudent) => {
        JobStatuses = [...JobStatuses, ...getRecentJobsStatus(student.Events)];
      });
      JobStatuses.forEach((status: string) => {
        if(dataObj[`${status}`]){
          dataObj[`${status}`] = true;
        }else{
          newJobStatuses.push({name: status});
        }
      })
      setFilterOptionsArray([
        {
          filterBy: "Course",
          label: "קורס",
          possibleValues: newCourseNames,
        },
        {
          filterBy: "Class",
          label: "כיתה",
          possibleValues: newClassNames,
        },
        {
          filterBy: "JobStatus",
          label: "סטטוס השמה",
          possibleValues: newJobStatuses,
        },
        {
          filterBy: "Name",
          label: "שם",
          possibleValues: newFullNames,
        },
        {
          filterBy: "Languages",
          label: "שפות",
          possibleValues: [{name : "עברית"},{name : "אנגלית"},{name : "ספרדית"},{name : "רוסית"},{name : "ערבית"}],
        },
        {
          filterBy: "AverageScore",
          singleOption: true,
          label: "ממוצע ציונים",
          possibleValues: [{name: "עולה"}, {name :"יורד"}],
        }
      ]);
      setLoading(false);
    })();
  }, []);
  useEffect(() => {
    if (students) {
      setFilteredStudents(students);
    }
  }, [students]);

  const filterFunc = (arr?: IStudent[]) => { //useCallback(
    const array = arr || students
    return array.filter((student) => {
      const addressCondition = addressName ? student.address.toLowerCase().includes(addressName) : true;
      // const languageCondition = 
      // filterAttributes.Languages!.length === 1 &&
      // filterAttributes.Languages![0] === ""
      //   ? true :
      // filterAttributes.Languages!.every((lang:string) =>!student.languages? false :student.languages.includes(lang));
      // const classCondition =
      //   filterAttributes.Class!.length === 1 &&
      //   filterAttributes.Class![0] === ""
      //     ? true
      //     : filterAttributes.Class!.includes(student.Class.name);
      // const courseCondition =
      //   filterAttributes.Course!.length === 1 &&
      //   filterAttributes.Course![0] === ""
      //     ? true
      //     : filterAttributes.Course!.includes(student.Class.course);
      // const recentJobStatus = getRecentJobsStatus(student.Events);
      // const jobless =
      //   recentJobStatus.length === 0 ||
      //   recentJobStatus.every((status) => status === "Rejected");
      // const jobStatusCondition =
      //   filterAttributes.JobStatus!.length === 1 &&
      //   filterAttributes.JobStatus![0] === ""
      //     ? true
      //     : (filterAttributes.JobStatus!.includes("None") && jobless) ||
      //       filterAttributes.JobStatus!.find((status) =>
      //         recentJobStatus.includes(status)
      //       );
      // const studentIdCondition =
      //   filterAttributes.Name!.length === 1 &&
      //   filterAttributes.Name![0] === ""
      //     ? true
      //     : filterAttributes.Name!.some((val: string) => String(val) === String(student.id));
      return  addressCondition; //jobStatusCondition &&
        // classCondition &&
        // courseCondition &&
        // studentIdCondition &&

        // languageCondition
      
    });
  }//, [filterAttributes,  addressName]);
  const getStudentsByFilters = async () => {
    try{
      const {data} = await network.get('/api/v1/student/filtered', {
        params: filterAttributes
      })
      const filtered = filterFunc(data)
      const studentIds = filtered.map((student: IStudent) => String(student.id));
      setGradeParams({...gradeParams, studentIds: studentIds});
      setFilteredStudents(filtered);
      setLoading(false)
    }catch(e){

    }
  }
  useEffect(() => {
    setLoading(true)
    getStudentsByFilters();
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
            widthPercent={100}
          />
        </div>
        <div style={{ display: "flex", marginBottom: "40px",}}>
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
          <div style={{width:"10%", marginLeft: '10px'}}>
          <Select 
            multiple
            labelId={`demo-simple-select-label-Skills`}
            style={{ height: "100%", width: "100%", marginLeft: '20px' }} 
            defaultValue={ [""]}
            onChange={(e:any) => {
              const value = e.target.value as string | string[] | undefined;
              if(value && typeof value === "object"){
                if(value.filter(val => val != "").length === 0){
                  return setGradeParams({...gradeParams, labelIds: [""]})
                }
                return setGradeParams({...gradeParams, labelIds: value.filter(val => val != "")})
              }
              return setGradeParams({...gradeParams, labelIds: [""]})
            }}
          >
            <MenuItem value="" disabled>Skills</MenuItem>
            {labelOptions.map((val: {name: string, id: string}) => (
              <MenuItem value={val.id}>{val.name}</MenuItem>
            ))}
          </Select>
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
              <TableHeader repeatFormula={`${'0.5fr '.repeat(gradeParams.labelIds.filter(param => param !== "").length)}0.8fr 1.2fr 1fr 1.2fr 1fr 1fr 0.5fr`}>
                {gradeParams.labelIds.length > 0 &&gradeParams.labelIds.map((labelId: string) => {
                  if(labelId === "") return null;
                  const obj = labelOptions.find((obj:{id: string, name: string}) => obj.id == labelId);
                return <StyledSpan weight="bold">{obj? capitalize(obj.name) : labelId}</StyledSpan>
                })}
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
                  <StyledDiv repeatFormula={`${'0.5fr '.repeat(gradeParams.labelIds.filter(param => param !== "").length)}0.8fr 1.2fr 1fr 1.2fr 1fr 1fr 0.5fr`}>
                  {gradeParams.labelIds.length > 0 &&gradeParams.labelIds.map((labelId: string) => {
                    if(labelId === "") return null;
                      const writing = !gradesByLabel[labelId]? 0 :
                        !gradesByLabel[labelId][`${student.id}`] ? 0 : 
                        Math.round(gradesByLabel[labelId][`${student.id}`].sum / gradesByLabel[labelId][`${student.id}`].count)
                  return <StyledSpan>{writing}</StyledSpan>
                  })}
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
                  <StyledSpan>{student.AcademicBackgrounds.length > 0 ? student.AcademicBackgrounds[0].gradeAvg : ''}</StyledSpan>
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
