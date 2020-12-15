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
import Button from "@material-ui/core/Button";
import { IMentorProgram } from "../../typescript/interfaces";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import ClassIcon from "@material-ui/icons/Class";
import { capitalize } from "../../helpers/general";

const MentorPrograms: React.FC = () => {
  const [programs, setPrograms] = useState<IMentorProgram[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getPrograms = useCallback(async () => {
    const { data } = await network.get("/api/v1/M/program/all");
    console.log(data)
    setPrograms(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    getPrograms();
  }, [getPrograms]);


  return (
    <Wrapper width="80%">
      <Center>
        <TitleWrapper>
          <H1 color="#c47dfa">All Mentor Programs</H1>
        </TitleWrapper>
        <br />
        <StyledLink to="/mentor/all">
          <Button
            variant="contained"
            style={{ backgroundColor: "#c47dfa", color: "white" }}
          >
            All Mentors
          </Button>
        </StyledLink>
        <StyledLink to="/mentor/new">
          <Button
            variant="contained"
            style={{
              backgroundColor: "#c47dfa",
              color: "white",
              marginLeft: 10,
            }}
          >
            new project
          </Button>
        </StyledLink>
      </Center>
      <br />
      <Loading loading={loading} size={30}>
        <StyledUl>
          {programs && (
            <li>
              <TableHeader repeatFormula="1fr 2.5fr 2.5fr 2.5fr 1fr">
                <ClassIcon />
                <StyledSpan weight="bold">Program Name</StyledSpan>
                <StyledSpan weight="bold">Start Date</StyledSpan>
                <StyledSpan weight="bold">End Date</StyledSpan>
                <StyledSpan weight="bold">Edit</StyledSpan>
              </TableHeader>
            </li>
          )}
          {programs &&
            programs.map((program,i) =>{
              const color:string = program.open? "#b5e8ca":"#b06363";
              return(
              <li key={i} style={{backgroundColor:color}}>
                <StyledLink to={`/mentor/program/${program.id}`} color="black">
                  <StyledDiv repeatFormula="1fr 2.5fr 2.5fr 2.5fr 1fr">
                    <ClassIcon />
                    <StyledSpan weight="bold">
                      {capitalize(program.name)}
                    </StyledSpan>
                    <StyledSpan>{new Date(program.startDate).toLocaleDateString()}</StyledSpan>
                    <StyledSpan>{new Date(program.endDate).toLocaleDateString()}</StyledSpan>
                    <StyledSpan><Button>Edit</Button></StyledSpan>
                  </StyledDiv>
                </StyledLink>
              </li>
              )
            })
          }
        </StyledUl>
      </Loading>
    </Wrapper>
  );
};

export default MentorPrograms;
