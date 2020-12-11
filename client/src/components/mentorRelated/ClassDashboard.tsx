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
import { useParams } from "react-router-dom";
import { IClass, MentorClassDashboard } from "../../typescript/interfaces";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import ClassIcon from "@material-ui/icons/Class";
import { capitalize } from "../../helpers/general";

const ClassDashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [tabelsData, setTabelData] = useState<MentorClassDashboard[]>([]);
  const { id } = useParams();

  const getTableData = useCallback(async () => {
    const { data } = await network.get(`/api/v1/M/meeting/class/${id}`);
    console.log(data);
    setTabelData(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    getTableData();
  }, []);

  return (
    <Wrapper width="80%">
      <Center>
        <TitleWrapper>
          <Loading loading={loading} size={30}>
            {tabelsData[0] && (
              <H1 color="#2c6e3c">{`${tabelsData[0].Class.name} - ${tabelsData[0].Class.cycleNumber}`}</H1>
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
                <StyledSpan weight="bold">Company</StyledSpan>
                <StyledSpan weight="bold">Email</StyledSpan>
                <StyledSpan weight="bold">Job</StyledSpan>
                <StyledSpan weight="bold">Student Name</StyledSpan>
                <StyledSpan weight="bold">Meetings</StyledSpan>
              </TableHeader>
            </li>
          )}
          {tabelsData &&
            tabelsData.map((row) => (
              <li>
                <StyledDiv repeatFormula="0.5fr 1fr 1fr 1.5fr 1fr 1fr 1fr">
                  <ClassIcon />
                  <StyledLink to={`/mentor/${row.id}`} color="black">
                    <StyledSpan weight="bold">
                      {capitalize(row.Mentor.name)}
                    </StyledSpan>
                  </StyledLink>
                  <StyledSpan>{row.Mentor.company}</StyledSpan>
                  <StyledSpan>{row.Mentor.email}</StyledSpan>
                  <StyledSpan>{row.Mentor.job}</StyledSpan>
                  <StyledLink to={`/student/${row.id}`} color="black">
                    <StyledSpan>{`${row.firstName} ${row.lastName}`}</StyledSpan>
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
                          <div style={{ color: color }}>
                            {meet.date &&
                              `${i + 1} - ${meet.date.slice(0, 10)}`}
                          </div>
                        );
                      })}
                  </StyledSpan>
                </StyledDiv>
              </li>
            ))}
        </StyledUl>
      </Loading>
    </Wrapper>
  );
};

export default ClassDashboard;