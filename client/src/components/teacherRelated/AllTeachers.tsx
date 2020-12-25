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
  TableHeader,
  StyledDiv,
  repeatFormula,
} from "../../styles/styledComponents";
import Button from "@material-ui/core/Button";
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import { ITeacher } from "../../typescript/interfaces";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { capitalize } from "../../helpers/general";

function AllTeachers() {
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const { data } = await network.get("/api/v1/teacher/all");
      console.log(data)
      setTeachers(data);
      setLoading(false);
    })();
  }, []);

  return (
    <Wrapper width='80%'>
      <Center>
        <TitleWrapper>
          <H1 color='#e2e600'>All Teachers</H1>
        </TitleWrapper>
        <br />
        <StyledLink to='/teacher/add'>
          <Button
            style={{ backgroundColor: "#e2e600", color: "white" }}
            variant='contained'
          >
            Add Teacher
          </Button>
        </StyledLink>
      </Center>
      <br />
      <Loading loading={loading} size={30}>
        <StyledUl>
          {teachers && (
            <li>
              <TableHeader repeatFormula="0.5fr 1.5fr 1.8fr 1.5fr 1.8fr 1.25fr">
                <PersonOutlineIcon />
                <StyledSpan weight='bold'>Name</StyledSpan>
                <StyledSpan weight='bold'>Email</StyledSpan>
                <StyledSpan weight='bold'>Phone</StyledSpan>
                <StyledSpan weight='bold'>ID</StyledSpan>
                <StyledSpan weight='bold'>Classes</StyledSpan>
                {/* <StyledSpan weight='bold'>I.D</StyledSpan> */}
              </TableHeader>
            </li>
          )}
          {teachers &&
            teachers.map((teacher) => (
              <li>
                <StyledLink to={`/teacher/${teacher.id}`} color='black'>
                  <StyledDiv repeatFormula="0.5fr 1.5fr 1.8fr 1.5fr 1.8fr 1.25fr">
                    <PersonOutlineIcon />
                    <StyledSpan weight='bold'>
                      {`${capitalize(teacher.firstName)} ${capitalize(teacher.lastName)}`}
                    </StyledSpan>
                    <StyledSpan>{teacher.email}</StyledSpan>
                    <StyledSpan>{teacher.phone}</StyledSpan>
                    <StyledSpan>{teacher.idNumber}</StyledSpan>
                    <StyledSpan>{teacher.Classes?.length}</StyledSpan>
                  </StyledDiv>
                </StyledLink>
              </li>
            ))}
        </StyledUl>
      </Loading>
    </Wrapper>
  );
}

export default AllTeachers;
