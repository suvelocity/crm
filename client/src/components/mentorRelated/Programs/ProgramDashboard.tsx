import React, { useState, useEffect, useCallback, useContext } from "react";
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
  IMentorProgramForms,
  ITask,
} from "../../../typescript/interfaces";
import { Loading } from "react-loading-wrapper";
import { AuthContext } from "../../../helpers";
import "react-loading-wrapper/dist/index.css";
import ClassIcon from "@material-ui/icons/Class";
import { capitalize } from "../../../helpers/general";
import AddFormModal from "./AddFormModal";
import { formatToIsraeliDate } from "../../../helpers/general";
import Swal from "sweetalert2";
import DeleteIcon from "@material-ui/icons/Delete";
import SendMailModal from "./SendMailsModal";
import PickMentorModal from "./PickMentorModal";

const ProgramDashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [tabelsData, setTabelData] = useState<IMentorProgramDashboard[]>([]);
  const [programdetails, setProgramDetails] = useState<IMentorProgram>();
  const [forms, setForms] = useState<IMentorProgramForms>();
  const [availableMentors, setAvailableMentors] = useState<any[]>([]);
  const { id } = useParams();
  const history = useHistory();
  const { user } = useContext<any>(AuthContext);

  const getTableData = useCallback(async () => {
    const program = await network.get(`/api/v1/M/program/${id}`);
    setProgramDetails(program.data);
    const dashboardData = await network.get(
      `/api/v1/M/program/dashboard/${id}`
    );
    setTabelData(dashboardData.data);
    setLoading(false);
  }, [id]);

  const getAvailableMentors = useCallback(async () => {
    if(programdetails && programdetails.classId){
      const { data } = await network.get(`/api/v1/M/mentor?classId=${programdetails.classId}`);
      setAvailableMentors(data);
    }
  }, [programdetails]);

  const getForms = useCallback(async () => {
    const formsData = await network.get(`/api/v1/M/program/forms/${id}`);
    setForms(formsData.data);
  }, [id]);

  useEffect(() => {
    getTableData();
    getForms();
  }, [id]);
  useEffect(() => {
    getAvailableMentors();
  }, [programdetails])

  const endProgram = async () => {
    try {
      await network.put(`/api/v1/M/program/end/${id}`);
      history.push("/mentor");
    } catch (err) {
      console.error(err.message);
    }
  };

  const promptAreYouSure: () => Promise<boolean> = async () => {
    return Swal.fire({
      title: "Are you sure?",
      text: "This Form will delete, and you would'nt watch it any more ",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#2fa324",
      confirmButtonText: "Delete!",
    }).then((result) => {
      if (result.isConfirmed) return true;
      return false;
    });
  };

  const deleteForm = async (id: number) => {
    const res: boolean = await promptAreYouSure();
    if (!res) return;
    try {
      await network.patch("/api/v1/M/form/delete", { formId: id });
      getForms();
    } catch (err) {
      Swal.fire("Error Occurred", err.message, "error");
    }
  };

  const postTask = async (title: string, url: string, id: number) => {
    try {
      const task: ITask = {
        title: `mentor program form -${title}`,
        externalLink: url,
        createdBy: 1 /*user.id*/,
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        type: "manual",
        status: "active",
      };
      const studentsToTask = tabelsData.map((student) => student.id);
      await network.post("/api/v1/task/tostudents", {
        ...task,
        idArr: studentsToTask,
      });
      await network.put(`/api/v1/M/program/editForm/${id}`);
      getForms();
      Swal.fire("Success", "task added successfully", "success");
    } catch (err) {
      Swal.fire("Error Occurred", err.message, "error");
    }
  };

  return (
    <>
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
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <Button
              style={{ backgroundColor: "#fa8c84" }}
              onClick={() => endProgram()}
            >
              End Program
            </Button>
            <Button
              onClick={() =>
                history.push(
                  `/mentor/new/${id}?class=${programdetails?.classId}`
                )
              }
              style={{ backgroundColor: "#fa8c84", margin: 10 }}
            >
              Edit Program
            </Button>
          </div>
          <div>
            <AddFormModal getForms={getForms} id={id} />
            <SendMailModal
              id={id}
              forms={forms}
              startMail={programdetails?.email}
              getProgram={getTableData}
            />
            <Button
              disabled={programdetails?.email ? true : false}
              style={{
                textAlign: "center",
                margin: 10,
                backgroundColor: "#c47dfa",
              }}
              variant="contained"
              onClick={async () => {
                await network.post(`/api/v1/M/program/startmails/${id}`);
                await getTableData();
              }}
            >
              Start Program Mail
            </Button>
          </div>
        </div>
        <Loading loading={loading} size={30}>
          <StyledUl>
            {tabelsData && (
              <li key="li">
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
              tabelsData.map((row, i) => (
                <li key={i}>
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
                          <StyledLink
                            to={`/mentor/meeting/${row.MentorStudents[0].id}`}
                            color="black"
                          >
                            <Button>Show</Button>
                          </StyledLink>
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
                      <PickMentorModal
                        getTableData={getTableData}
                        getAvailableMentors={getAvailableMentors}
                        availableMentors={availableMentors}
                        row={row}
                        id={id}
                      />
                    </StyledSpan>
                  </StyledDiv>
                </li>
              ))}
          </StyledUl>
        </Loading>
      </Wrapper>
      {forms?.MentorForms && forms.MentorForms[0] && (
        <Wrapper width="80%">
          <Center>
            <TitleWrapper>
              <Loading loading={loading} size={30}>
                {programdetails && <H1 color="#c47dfa">PROGRAM FORMS</H1>}
              </Loading>
            </TitleWrapper>
          </Center>
          <StyledUl>
            <li key="li">
              <TableHeader repeatFormula="1fr 1fr 1fr 0.2fr">
                <StyledSpan weight="bold">Title</StyledSpan>
                <StyledSpan weight="bold">Create Date</StyledSpan>
                <StyledSpan weight="bold">Send</StyledSpan>
              </TableHeader>
            </li>
            {forms.MentorForms.map((form, i) => (
              <li key={i}>
                <StyledDiv repeatFormula="1fr 1fr 1fr 0.2fr">
                  <a
                    style={{ color: "black", textDecoration: "none" }}
                    href={form.url}
                    color="black"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <StyledSpan>{form.title}</StyledSpan>
                  </a>
                  <a
                    style={{ color: "black", textDecoration: "none" }}
                    href={form.url}
                    color="black"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <StyledSpan>
                      {formatToIsraeliDate(form.createdAt)}
                    </StyledSpan>
                  </a>
                  <StyledSpan>
                    <Button
                      onClick={() =>
                        postTask(form.title, form.answerUrl, form.id!)
                      }
                      disabled={form.sent ? true : false}
                    >
                      {!form.sent ? "send to the students" : "Sent!"}
                    </Button>
                  </StyledSpan>
                  <StyledSpan>
                    <DeleteIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => deleteForm(form.id!)}
                    />
                  </StyledSpan>
                </StyledDiv>
              </li>
            ))}
          </StyledUl>
        </Wrapper>
      )}
    </>
  );
};

export default ProgramDashboard;
