import React, { useCallback, useEffect, useState } from "react";
import {
  H1,
  Wrapper,
  TitleWrapper,
  Center,
  StyledSpan,
  TableHeader,
  StyledDiv,
  StyledUl,
  StyledLink,
} from "../../styles/styledComponents";
import PersonIcon from "@material-ui/icons/Person";
import { useParams } from "react-router-dom";
import network from "../../helpers/network";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { IStudent, IClass, IMentor } from "../../typescript/interfaces";
import { capitalize, formatPhone } from "../../helpers/general";

function NewClassMentorProject() {
  const [cls, setCls] = useState<IClass | null>();
  const [mentors, setMentors] = useState<IMentor[] | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();

  const getClass = useCallback(async () => {
    const { data }: { data: IClass } = await network.get(
      `/api/v1/class/byId/${id}`
    );
    console.log(data);
    
    setCls(data);
    setLoading(false);
  }, [id, setLoading, setCls]);

  const getMentors = useCallback(async () => {
    const { data }: { data: IMentor[] } = await network.get(
      `/api/v1/mentor/mentor`
    );
    console.log(data);
    setMentors(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    try {
      getClass();
      getMentors();
    } catch (e) {
      console.log(e.message);
    }
    //eslint-disable-next-line
  }, [getClass]);

  return (
    <div style={{display:"flex"}}>
      <Wrapper width="40%">
        <Center>
          <TitleWrapper>
            <H1 color={"#2c6e3c"}>Students In Class</H1>
          </TitleWrapper>
        </Center>
        <br />
        <Loading loading={loading} size={30}>
          <StyledUl>
            {cls?.Students && (
              <li>
                <TableHeader repeatFormula="0.4fr 1fr 1fr 1.5fr">
                  <PersonIcon />
                  <StyledSpan weight="bold">Name</StyledSpan>
                  <StyledSpan weight="bold">Address</StyledSpan>
                  <StyledSpan weight="bold">Select Mentor</StyledSpan>
                </TableHeader>
              </li>
            )}
            {cls?.Students &&
              cls?.Students!.map((student: Omit<IStudent, "Class">) => (
                <li key={student.id}>
                  <StyledLink color="black" to={`/student/${student.id}`}>
                    <StyledDiv repeatFormula="0.4fr 1fr 1fr 1.5fr">
                      <PersonIcon />
                      <StyledSpan weight="bold">
                        {capitalize(student.firstName)}{" "}
                        {capitalize(student.lastName)}
                      </StyledSpan>
                      <StyledSpan>{student.address}</StyledSpan>
                      <StyledSpan>{}</StyledSpan>
                    </StyledDiv>
                  </StyledLink>
                </li>
              ))}
          </StyledUl>
        </Loading>
      </Wrapper>

      <Wrapper width="40%">
        <Center>
          <TitleWrapper>
            <H1 color={"#2c6e3c"}>Available Mentors</H1>
          </TitleWrapper>
        </Center>
        <br />
        <Loading loading={loading} size={30}>
          <StyledUl>
            {cls?.Students && (
              <li>
                <TableHeader repeatFormula="0.5fr 1fr 1fr 1fr 1fr">
                  <PersonIcon />
                  <StyledSpan weight="bold">Name</StyledSpan>
                  <StyledSpan weight="bold">Address</StyledSpan>
                  <StyledSpan weight="bold">company</StyledSpan>
                  <StyledSpan weight="bold">job</StyledSpan>
                  {/* <StyledSpan weight="bold">email</StyledSpan>
                  <StyledSpan weight="bold">phone</StyledSpan> */}
                </TableHeader>
              </li>
            )}
            {mentors &&
              mentors.map((mentor,i) => (
                <li key={i}>
                  <StyledLink color="black" to={`/mentor/${mentor.id}`}>
                    <StyledDiv repeatFormula="0.5fr 1fr 1fr 1fr 1fr">
                      <PersonIcon />
                      <StyledSpan weight="bold">
                        {capitalize(mentor.name)}
                      </StyledSpan>
                      <StyledSpan>{mentor.address}</StyledSpan>
                      <StyledSpan>{mentor.company}</StyledSpan>
                      <StyledSpan>{mentor.job}</StyledSpan>
                    </StyledDiv>
                  </StyledLink>
                </li>
              ))}
          </StyledUl>
        </Loading>
      </Wrapper>
    </div>
  );
}

export default NewClassMentorProject;
