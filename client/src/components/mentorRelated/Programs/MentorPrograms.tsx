import React, { useState, useEffect, useCallback } from "react";
import network from "../../../helpers/network";
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
} from "../../../styles/styledComponents";
import { IMentorProgram } from "../../../typescript/interfaces";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import ClassIcon from "@material-ui/icons/Class";
import { capitalize } from "../../../helpers/general";
import EditProgramModal from "./EditProgramModal";

const MentorPrograms: React.FC = () => {
  const [programs, setPrograms] = useState<IMentorProgram[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getPrograms = useCallback(async () => {
    const { data } = await network.get("/api/v1/M/program/all");
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
      </Center>
      <br />
      <Loading loading={loading} size={30}>
        <StyledUl>
          {programs && (
            <li>
              <TableHeader repeatFormula="1fr 2.5fr 1.5fr">
                <ClassIcon />
                <StyledSpan weight="bold">Program Name</StyledSpan>
                <StyledSpan weight="bold">Edit</StyledSpan>
              </TableHeader>
            </li>
          )}
          {programs &&
            programs.map((program, i) => {
              const color: string = program.open ? "#b5e8ca" : "#b06363";
              return (
                <li key={i} style={{ backgroundColor: color }}>
                  <StyledDiv repeatFormula="1fr 2.5fr 1.5fr">
                    <ClassIcon />
                    <StyledLink
                      to={`/mentor/program/${program.id}`}
                      color="black"
                    >
                      <StyledSpan weight="bold">
                        {capitalize(program.name)}
                      </StyledSpan>
                    </StyledLink>
                    <StyledSpan>
                      <EditProgramModal program={program!} getPrograms={getPrograms} />
                    </StyledSpan>
                  </StyledDiv>
                </li>
              );
            })}
        </StyledUl>
      </Loading>
    </Wrapper>
  );
};

export default MentorPrograms;
