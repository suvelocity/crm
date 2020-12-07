import React, { useState, useEffect } from "react";
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
import { IClass } from "../../typescript/interfaces";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import ClassIcon from "@material-ui/icons/Class";
import { capitalize } from "../../helpers/general";

function AllClasses() {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const { data } = await network.get("/api/v1/class/all");
      setClasses(data);
      setLoading(false);
    })();
  }, []);

  return (
    <Wrapper width="80%">
      <Center>
        <TitleWrapper>
          <H1 color="#2c6e3c">All Classes</H1>
        </TitleWrapper>
        <br />
        <StyledLink to="/class/add">
          <Button
            variant="contained"
            style={{ backgroundColor: "#2c6e3c", color: "white" }}
          >
            Add Class
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
                <StyledLink to={`/class/${cls.id}`} color="black">
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
}

export default AllClasses;
