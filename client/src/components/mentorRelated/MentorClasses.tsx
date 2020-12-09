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
import { IClass, MentorClassDashboard } from "../../typescript/interfaces";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import ClassIcon from "@material-ui/icons/Class";
import { capitalize } from "../../helpers/general";

const MentorClasses: React.FC = () => {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getClasses = useCallback(async () => {
    const { data } = await network.get("/api/v1/mentor/classes/with");
    setClasses(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    getClasses();
  }, []);

  return (
    <Wrapper width="80%">
      <Center>
        <TitleWrapper>
          <H1 color="#2c6e3c">Mentor Management</H1>
        </TitleWrapper>
        <br />
        <StyledLink to="/mentor/all">
          <Button
            variant="contained"
            style={{ backgroundColor: "#2c6e3c", color: "white" }}
          >
            All Mentors
          </Button>
        </StyledLink>
        <StyledLink to="/mentor/new">
          <Button
            variant="contained"
            style={{
              backgroundColor: "#2c6e3c",
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
          {classes && (
            <li>
              <TableHeader repeatFormula="1fr 2.5fr 2.5fr 1fr">
                <ClassIcon />
                <StyledSpan weight="bold">Name</StyledSpan>
                <StyledSpan weight="bold">Course</StyledSpan>
                <StyledSpan weight="bold">Cycle number</StyledSpan>
              </TableHeader>
            </li>
          )}
          {classes &&
            classes.map((cls) => (
              <li>
                <StyledLink to={`/mentor/class/${cls.id}`} color="black">
                  <StyledDiv repeatFormula="1fr 2.5fr 2.5fr 1fr">
                    <ClassIcon />
                    <StyledSpan weight="bold">
                      {capitalize(cls.name)}
                    </StyledSpan>
                    <StyledSpan>{capitalize(cls.course)}</StyledSpan>
                    <StyledSpan>{cls.cycleNumber}</StyledSpan>
                  </StyledDiv>
                </StyledLink>
              </li>
            ))}
        </StyledUl>
      </Loading>
    </Wrapper>
  );
};

export default MentorClasses;
