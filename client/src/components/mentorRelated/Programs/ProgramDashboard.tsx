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
import { Button } from "@material-ui/core";
import { useParams, useHistory } from "react-router-dom";
import {
  IMentorProgramDashboard,
  IMentorProgram,
} from "../../../typescript/interfaces";
import EditIcon from "@material-ui/icons/Edit";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import ClassIcon from "@material-ui/icons/Class";
import { capitalize } from "../../../helpers/general";
import SimpleModal from "../Modal";

const ProgramDashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [tabelsData, setTabelData] = useState<IMentorProgramDashboard[]>([]);
  const [programdetails, setProgramDetails] = useState<IMentorProgram>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalBody, setModalBody] = useState<any>();
  const [availableMentors, setAvailableMentors] = useState<any[]>([]);
  const { id } = useParams();
  const history = useHistory();

  const getTableData = useCallback(async () => {
    const program = await network.get(`/api/v1/M/program/${id}`);
    setProgramDetails(program.data);
    const dashboardData = await network.get(
      `/api/v1/M/program/dashboard/${id}`
    );
    console.log("dashboardData", dashboardData.data);
    setTabelData(dashboardData.data);
    setLoading(false);
  }, []);

  const getAvailableMentors = useCallback(async () => {
    const { data } = await network.get(`/api/v1/M/mentor/available`);
    setAvailableMentors(data);
  }, []);

  useEffect(() => {
    getTableData();
    getAvailableMentors();
  }, [getTableData, getAvailableMentors]);

  console.log(availableMentors);

  const endProgram = async () => {
    try {
      await network.put(`/api/v1/M/program/end/${id}`);
      history.push("/mentor");
    } catch (err) {
      console.error(err.message);
    }
  };

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
              <TableHeader repeatFormula="0.5fr 1fr 1fr 1fr 1fr 0.75fr 0.5fr">
                <ClassIcon />
                <StyledSpan weight="bold">Student Name</StyledSpan>
                <StyledSpan weight="bold">Mentor Name</StyledSpan>
                <StyledSpan weight="bold">Mentor Company</StyledSpan>
                <StyledSpan weight="bold">Meetings</StyledSpan>
                <StyledSpan weight="bold">Pair Page</StyledSpan>
              </TableHeader>
            </li>
          )}
          {tabelsData &&
            tabelsData.map((row) => (
              <li>
                <StyledDiv repeatFormula="0.5fr 1fr 1fr 1fr 1fr 0.75fr 0.5fr">
                  <ClassIcon />
                  <StyledLink to={`/student/${row.id}`} color="black">
                    <StyledSpan weight="bold">{`${row.firstName} ${row.lastName}`}</StyledSpan>
                  </StyledLink>
                  {row.MentorStudents &&
                  row.MentorStudents[0] &&
                  row.MentorStudents[0].Mentor ? (
                    <>
                      <StyledLink
                        to={`/mentor/${row.MentorStudents[0].Mentor.id}`}
                        color="black"
                      >
                        <StyledSpan weight="bold">
                          {capitalize(row.MentorStudents[0].Mentor.name)}
                        </StyledSpan>
                      </StyledLink>
                      <StyledSpan>
                        {row.MentorStudents[0].Mentor.company}
                      </StyledSpan>
                      <StyledSpan>
                        {row.MentorStudents[0].Meetings &&
                          row.MentorStudents[0].Meetings.length}
                      </StyledSpan>
                      <StyledSpan>
                      <StyledLink to={`/mentor/meeting/${row.MentorStudents[0].id}`} color="black"><Button>Show</Button></StyledLink>
                      </StyledSpan>
                    </>
                  ) : (
                    <>
                      <span>-</span>
                      <span>-</span>
                      <span>-</span>
                      <span>-</span>
                    </>
                  )}
                  <StyledSpan>
                    <Button
                      onClick={async () => {
                        setModalBody(
                          <div>
                            <H1>Pick Mentor</H1>
                            <StyledUl>
                              {availableMentors.map((mentor) => (
                                <li>
                                  <StyledDiv
                                    repeatFormula="0.5fr 1fr 1fr 1fr 1fr "
                                    onClick={async () => {
                                      row.MentorStudents &&
                                      row.MentorStudents[0] &&
                                      row.MentorStudents[0].Mentor
                                        ? await network.put(
                                            `/api/v1/M/classes/${row.MentorStudents[0].id}`,
                                            {
                                              mentorProgramId: id,
                                              mentorId: mentor.id,
                                              studentId: row.id,
                                            }
                                          )
                                        : await network.post(
                                            "/api/v1/M/classes",
                                            {
                                              mentorProgramId: id,
                                              mentorId: mentor.id,
                                              studentId: row.id,
                                            }
                                          );
                                      getTableData();
                                      getAvailableMentors();
                                      setModalOpen(false);
                                    }}
                                  >
                                    <StyledSpan weight="bold">
                                      {mentor.MentorStudents.length || 0}
                                    </StyledSpan>
                                    <StyledSpan weight="bold">
                                      {capitalize(mentor.name)}
                                    </StyledSpan>
                                    <StyledSpan>{mentor.address}</StyledSpan>
                                    <StyledSpan>{mentor.company}</StyledSpan>
                                    <StyledSpan>{mentor.job}</StyledSpan>
                                  </StyledDiv>
                                </li>
                              ))}
                            </StyledUl>
                          </div>
                        );
                        setModalOpen(true);
                      }}
                    >
                      <EditIcon/>
                    </Button>
                  </StyledSpan>
                </StyledDiv>
              </li>
            ))}
        </StyledUl>
        <Button style={{ backgroundColor: "#fa8c84" }} onClick={() => endProgram()}>
          End Program
        </Button>
        <Button
          onClick={() =>
            history.push(`/mentor/new/${id}?class=${programdetails?.classId}`)
          }
          style={{ backgroundColor: "#fa8c84", margin: 10 }}
        >
          Edit Program
        </Button>
        <SimpleModal
          open={modalOpen}
          setOpen={setModalOpen}
          modalBody={modalBody}
        />
      </Loading>
    </Wrapper>
  );
};

export default ProgramDashboard;
