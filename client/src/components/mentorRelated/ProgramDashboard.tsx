import React, { useState, useEffect, useCallback } from "react";
import network from "../../helpers/network";
import {
  H1,
  Wrapper,
  TitleWrapper,
  StyledLink,
  Center,
  StyledSpan,
  StyledUl,
  StyledDiv,
  TableHeader,
} from "../../styles/styledComponents";
import { Button } from "@material-ui/core";
import { useParams, useHistory } from "react-router-dom";
import { IClass, IMentorProgramDashboard, IMentorProgram } from "../../typescript/interfaces";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import ClassIcon from "@material-ui/icons/Class";
import { capitalize } from "../../helpers/general";

const ProgramDashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [tabelsData, setTabelData] = useState<IMentorProgramDashboard[]>([]);
  const [programdetails,setProgramDetails]=useState<IMentorProgram>();
  const { id } = useParams();
  const history = useHistory();

  const getTableData = useCallback(async () => {
    const program = await network.get(`/api/v1/M/program/${id}`);
    setProgramDetails(program.data)
    const dashboardData = await network.get(`/api/v1/M/program/dashboard/${id}`);
    console.log("dashboardData",dashboardData.data);
    setTabelData(dashboardData.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    getTableData();
  }, []);

  const endProgram = async () =>{
    try{
      await network.put(`/api/v1/M/program/end/${id}`)
      history.push('/mentor')
    }catch(err){
      console.error(err.message)
    }
  }

  return (
    <Wrapper width="80%">
      <Center>
        <TitleWrapper>
          <Loading loading={loading} size={30}>
            {programdetails && (
              <H1 color="#c47dfa">{`${programdetails.name}`}</H1>
            )}
          </Loading>
        </TitleWrapper>
      </Center>
      <br />
      <Loading loading={loading} size={30}>
        <StyledUl>
          {tabelsData && (
            <li>
              <TableHeader repeatFormula="0.5fr 1fr 1fr 1fr 1.5fr 1fr 0.5fr">
                <ClassIcon />
                <StyledSpan weight="bold">Student Name</StyledSpan>
                <StyledSpan weight="bold">Mentor Name</StyledSpan>
                <StyledSpan weight="bold">Mentor Company</StyledSpan>
                <StyledSpan weight="bold">Mentor Email</StyledSpan>
                <StyledSpan weight="bold">Meetings</StyledSpan>
                <StyledSpan weight="bold">Pair Page</StyledSpan>
              </TableHeader>
            </li>
          )}
          {tabelsData &&
            tabelsData.map((row) => (
              <li>
                  <StyledDiv repeatFormula="0.5fr 1fr 1fr 1fr 1.5fr 1fr 0.5fr">
                    <ClassIcon />
                    <StyledLink to={`/student/${row.id}`} color="black">
                      <StyledSpan weight="bold">{`${row.firstName} ${row.lastName}`}</StyledSpan>
                    </StyledLink>
                    {
                      row.MentorStudents && row.MentorStudents[0] && row.MentorStudents[0].Mentor ?
                      <>
                      <StyledLink to={`/mentor/${row.MentorStudents[0].Mentor.id}`} color="black">
                        <StyledSpan weight="bold">
                          {capitalize(row.MentorStudents[0].Mentor.name)}
                        </StyledSpan>
                      </StyledLink>
                      <StyledSpan>{row.MentorStudents[0].Mentor.company}</StyledSpan>
                      <StyledSpan>{row.MentorStudents[0].Mentor.email}</StyledSpan>
                      <StyledSpan>
                        {row.MentorStudents[0].Meetings &&
                          row.MentorStudents[0].Meetings.map((meet, i) => {
                            return (
                              <div>
                                {meet.date &&
                                  `${i + 1} - ${new Date(meet.date).toLocaleDateString()}`}
                              </div>
                            );
                          })}
                      </StyledSpan>
                      <StyledSpan><Button>Show</Button></StyledSpan>
                    </>:<StyledSpan><Button>Edit</Button></StyledSpan>
                    }
                  </StyledDiv>
              </li>
            ))}
        </StyledUl>
        <Button style={{backgroundColor: 'red'}} onClick={() => endProgram()}>End Program</Button>
      </Loading>
    </Wrapper>
  );
};

export default ProgramDashboard;
