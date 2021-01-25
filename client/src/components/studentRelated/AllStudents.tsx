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
  const fetchLabels = async() => {
    try{
      const {data} = await network.get('/api/v1/label/all');
      setLabelOptions(data)
    }catch(e){
      setLoading(false);
      console.log(e.message);
    }
  }
  const fetchOptions = async() => {
    try{
      const {data} = await network.get('/api/v1/student/filter-options');
      console.log("options", data)
      setFilterOptionsArray([
        {
          filterBy: "Course",
          label: "קורס",
          possibleValues: data.courses,
        },
        {
          filterBy: "Class",
          label: "כיתה",
          possibleValues: data.classes,
        },
        {
          filterBy: "JobStatus",
          label: "סטטוס השמה",
          possibleValues: data.statuses,
        },
        {
          filterBy: "Name",
          label: "שם",
          possibleValues: data.students,
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
          possibleValues: [{name: "עולה", id: 'DESC'}, {name :"יורד", id: 'ASC'}],
        }
      ]);
      setLoading(false);
    }catch(e){
      setLoading(false);
      console.log(e.message);
    }
  }
  useEffect(() => {
    fetchLabels()
    fetchOptions()
  }, []);

  const getStudentsByFilters = async () => {
    try{
      const {data} : {data: {students: IStudent[], gradedLabels?: LabelIdsWithGradesPerStudent} } = await network.get('/api/v1/student/filtered', {
        params: {...filterAttributes, ...gradeParams, addressName}
      })
      if(data.gradedLabels){
        setGradesByLabel(data.gradedLabels);
      }
      setFilteredStudents(data.students);
      setLoading(false)
    }catch(e){
      console.log(e)
      setLoading(false);
    }
  }
  useEffect(() => {
    setLoading(true)
    getStudentsByFilters();
  }, [filterAttributes, addressName, gradeParams]);

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
