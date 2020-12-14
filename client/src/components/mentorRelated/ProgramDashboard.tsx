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
import { IClass, IMentorClassDashboard, IMentorProgram } from "../../typescript/interfaces";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import ClassIcon from "@material-ui/icons/Class";
import { capitalize } from "../../helpers/general";

const ProgramDashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [tabelsData, setTabelData] = useState<IMentorClassDashboard[]>([]);
  const [programdetails,setProgramDetails]=useState<IMentorProgram>();
  const { id } = useParams();
  const history = useHistory();

  const getTableData = useCallback(async () => {
    const program = await network.get(`/api/v1/M/program/${id}`);
    console.log(program.data);
    setProgramDetails(program.data)
    const dashboardData = await network.get(`/api/v1/M/program/dashboard/${id}`);
    console.log(dashboardData.data);
    setTabelData(dashboardData.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    getTableData();
  }, []);

  const endProgram = async () =>{
    try{
      const res = await network.put(`/api/v1/M/program/end/${id}`, { students: tabelsData.length })
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
              <TableHeader repeatFormula="0.5fr 1fr 1fr 1.5fr 1fr 1fr 1fr">
                <ClassIcon />
                <StyledSpan weight="bold">Mentor Name</StyledSpan>
                <StyledSpan weight="bold">Mentor Company</StyledSpan>
                <StyledSpan weight="bold">Mentor Email</StyledSpan>
                <StyledSpan weight="bold">Student Name</StyledSpan>
                <StyledSpan weight="bold">Meetings</StyledSpan>
                <StyledSpan weight="bold">Pair Page</StyledSpan>
              </TableHeader>
            </li>
          )}
          {tabelsData &&
            tabelsData.map((row) => (
              <li>
                {row.Mentor ? (
                  <StyledDiv repeatFormula="0.5fr 1fr 1fr 1.5fr 1fr 1fr 1fr">
                    <ClassIcon />

                    <StyledLink to={`/mentor/${row.id}`} color="black">
                      <StyledSpan weight="bold">
                        {capitalize(row.Mentor.name)}
                      </StyledSpan>
                    </StyledLink>
                    <StyledSpan>{row.Mentor.company}</StyledSpan>
                    <StyledSpan>{row.Mentor.email}</StyledSpan>
                    <StyledLink to={`/student/${row.id}`} color="black">
                      <StyledSpan weight="bold">{`${row.firstName} ${row.lastName}`}</StyledSpan>
                    </StyledLink>
                    <StyledSpan>
                      {row.Meetings &&
                        row.Meetings.map((meet, i) => {
                          let color: string =
                            meet.date &&
                            new Date(meet.date).getTime() > Date.now()
                              ? "red"
                              : "green";
                          return (
                            <div>
                              {meet.date &&
                                `${i + 1} - ${new Date(meet.date).toLocaleDateString()}`}
                            </div>
                          );
                        })}
                    </StyledSpan>
                    <StyledSpan><Button>Show</Button></StyledSpan>
                  </StyledDiv>
                ) : (
                  <StyledDiv repeatFormula="0.5fr 1fr 2fr 1fr ">
                    <ClassIcon />
                    <StyledLink to={`/mentor/new/${id}`} color= 'black'>
                      <Button style={{backgroundColor: 'red'}}>Get Mentor</Button>
                      </StyledLink>
                      <div>--------</div>
                    <StyledLink to={`/student/${row.id}`} color="black">
                      <StyledSpan>{`${row.firstName} ${row.lastName}`}</StyledSpan>
                      </StyledLink>

                  </StyledDiv>
                )}
              </li>
            ))}
        </StyledUl>
        <Button style={{backgroundColor: 'red'}} onClick={() => endProgram()}>End Program</Button>
      </Loading>
    </Wrapper>
  );
};

export default ProgramDashboard;
