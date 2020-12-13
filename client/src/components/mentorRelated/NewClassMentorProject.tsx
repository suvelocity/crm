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
import DeleteIcon from "@material-ui/icons/Delete";
import { Button } from "@material-ui/core";
import { useParams } from "react-router-dom";
import network from "../../helpers/network";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { IStudent, IClass, IMentor } from "../../typescript/interfaces";
import { capitalize } from "../../helpers/general";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useHistory } from "react-router-dom";
import SimpleModal from "./Modal";

function NewClassMentorProject() {
  const [cls, setCls] = useState<IClass | undefined>();
  const [mentors, setMentors] = useState<IMentor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalBody, setModalBody] = useState<any>();
  const { id } = useParams();
  const history = useHistory();

  const getClass = useCallback(async () => {
    const { data }: { data: IClass } = await network.get(
      `/api/v1/class/byId/${id}`
    );
    data.Students = data.Students.filter((student) => !student.mentorId);
    setCls(data);
    setLoading(false);
  }, [id, setLoading, setCls]);

  const getMentors = useCallback(async () => {
    const { data }: { data: IMentor[] } = await network.get(`/api/v1/M/mentor`);
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
  }, [getClass, getMentors]);

  const onDropLeftEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) {
      const itemsMentor: IMentor[] = Array.from(mentors || []);
      const [reorderedMentor] = itemsMentor.splice(result.source.index, 1);
      itemsMentor.splice(result.destination.index, 0, reorderedMentor);
      setMentors(itemsMentor);
    } else if (
      source.droppableId === "mentors" &&
      destination.droppableId !== "students"
    ) {
      const itemsMentor: IMentor[] = Array.from(mentors || []);
      const itemsStudents: Omit<IStudent, "Class">[] = Array.from(
        cls!.Students || []
      );
      const [reorderedMentor]: IMentor[] = itemsMentor.splice(
        result.source.index,
        1
      );
      const prevMentor: IMentor | null = itemsStudents[
        parseInt(destination.droppableId)
      ].mentor!;
      if (prevMentor) {
        itemsMentor.push(prevMentor);
      }
      itemsStudents[parseInt(destination.droppableId)].mentor = reorderedMentor;
      const newCls: IClass | undefined = cls;
      newCls!.Students = itemsStudents;
      setCls(newCls);
      setMentors(itemsMentor);
    }
  };

  const removeMentor = (mentor: IMentor, i: number) => {
    console.log("delete");
    const newMentors: IMentor[] = Array.from(mentors);
    newMentors.push(mentor);
    setMentors(newMentors);
    const newCls: IClass | undefined = cls;
    newCls!.Students[i].mentor = null;
    setCls(newCls);
  };

  const saveMentor = async (student: Omit<IStudent, "Class">) => {
    try {
      await network.put(`/api/v1/M/classes/student/${student.id}`, {
        mentorId: student.mentor!.id,
      });
    } catch {
      return student.firstName + student.lastName;
    }
  };

  const createProgram = async () => {
    try {
      const newMentorsToDb = cls!.Students.filter((student) => student.mentor);
      const dontHaveMentor = cls!.Students.filter((student) => !student.mentor);
      if (dontHaveMentor.length > 0) {
        const newError = `${dontHaveMentor.length} students in this class not linked to a mentor`;
        setModalBody(
          <div>
            <div style={{ color: "red", fontWeight: "bold" }}>{newError}</div>
            <StyledSpan>{`Would you like to link ${newMentorsToDb.length} students anyway?`}</StyledSpan>
            <div>
              <Button
                style={{ backgroundColor: "green" }}
                onClick={() =>
                  newMentorsToDb.forEach((student: Omit<IStudent, "Class">) => {
                    saveMentor(student).then(async () => {
                      setModalBody(
                        <div
                          style={{ color: "green" }}
                        >{`${newMentorsToDb.length} students have new mentors!`}</div>
                      );
                      await network.put(`/api/v1/M/classes/${id}`);
                      history.push('/mentor')
                    }
                    );
                  })
                }
              >
                Continue
              </Button>
              <Button
                style={{ backgroundColor: "red" }}
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        );
        setModalOpen(true);
      } else {
        newMentorsToDb.forEach(async (student) => {
          if (student.mentorId !== student.mentor?.id) {
            await saveMentor(student);
          }
        });
        await network.put(`/api/v1/M/classes/${id}`);
        history.push("/mentor");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const resetMentors = (mentorizeClass: IClass | undefined) => {
    const mentorizeStudents: Omit<IStudent, "Class">[] = mentorizeClass!
      .Students;
    const backToMentors: IMentor[] = [];
    for (let i = 0; i < mentorizeStudents.length; i++) {
      if (mentorizeStudents[i].mentor && !mentorizeStudents[i].mentorId) {
        backToMentors.push(mentorizeStudents[i].mentor!);
        delete mentorizeStudents[i].mentor;
      }
    }
    setMentors(backToMentors.concat(mentors));
    setCls(mentorizeClass);
  };

  const assignMentors = (mentorizeClass: IClass | undefined) => {
    const mentorNeededCount: number = mentorizeClass!.Students.filter(
      (student) => !(student.mentor || student.mentorId)
    ).length;
    console.log(mentorNeededCount);
    if (mentorNeededCount <= mentors.length) {
      let mentorsCount: number = 0;
      for (let i = 0; i < mentorizeClass!.Students.length; i++) {
        const student = mentorizeClass!.Students[i];
        if (student.mentorId || student.mentor) continue;
        else {
          student.mentor = mentors[mentorsCount];
          mentorsCount++;
        }
      }
      setMentors(mentors.slice(-(mentors.length - mentorsCount)));
      setCls(mentorizeClass);
    } else console.log("not enough mentors");
  };

  return (
    <div style={{ display: "flex" }}>
      <DragDropContext onDragEnd={onDropLeftEnd}>
        <Wrapper width="40%">
          <Center>
            <TitleWrapper>
              <H1 color={"#c47dfa"}>
                Students In Class
                <Button
                  variant="contained"
                  onClick={createProgram}
                  style={{
                    backgroundColor: "#c47dfa",
                    color: "white",
                    marginLeft: 10,
                  }}
                >
                  create
                </Button>
                <Button onClick={() => assignMentors(cls)}>Generate</Button>
                <Button onClick={() => resetMentors(cls)}>Reset</Button>
              </H1>
            </TitleWrapper>
            <div style={{ color: "red" }}>{error}</div>
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
                cls?.Students!.map(
                  (student: Omit<IStudent, "Class">, i: number) => (
                    <li key={student.id}>
                      {/* <StyledLink color="black" to={`/student/${student.id}`}> */}
                      <StyledDiv repeatFormula="0.4fr 1fr 1fr 1.5fr">
                        <PersonIcon />
                        <StyledSpan weight="bold">
                          {capitalize(student.firstName)}{" "}
                          {capitalize(student.lastName)}
                        </StyledSpan>
                        <StyledSpan>{student.address}</StyledSpan>
                        <StyledSpan>
                          <Droppable droppableId={`${i}`}>
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                              >
                                {student.mentor && (
                                  <StyledSpan>
                                    {capitalize(student.mentor.name)}
                                    <Button
                                      onClick={() =>
                                        removeMentor(student.mentor!, i)
                                      }
                                    >
                                      <DeleteIcon />
                                    </Button>
                                  </StyledSpan>
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </StyledSpan>
                      </StyledDiv>
                      {/* </StyledLink> */}
                    </li>
                  )
                )}
            </StyledUl>
          </Loading>
        </Wrapper>

        <Wrapper width="40%">
          <Center>
            <TitleWrapper>
              <H1 color={"#c47dfa"}>Available Mentors</H1>
            </TitleWrapper>
          </Center>
          <br />
          <Loading loading={loading} size={30}>
            <StyledUl>
              <li>
                <TableHeader repeatFormula="0.5fr 1fr 1fr 1fr 1fr">
                  <PersonIcon />
                  <StyledSpan weight="bold">Name</StyledSpan>
                  <StyledSpan weight="bold">Address</StyledSpan>
                  <StyledSpan weight="bold">company</StyledSpan>
                  <StyledSpan weight="bold">job</StyledSpan>
                </TableHeader>
              </li>
              <Droppable droppableId="mentors">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {mentors &&
                      mentors.map((mentor, i) => (
                        <Draggable key={i} draggableId={`${i}`} index={i}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <StyledDiv repeatFormula="0.5fr 1fr 1fr 1fr 1fr">
                                <StyledLink
                                  to={`/mentor/${mentor.id}`}
                                  color="black"
                                >
                                  <PersonIcon />
                                </StyledLink>
                                <StyledSpan weight="bold">
                                  {capitalize(mentor.name)}
                                </StyledSpan>
                                <StyledSpan>{mentor.address}</StyledSpan>
                                <StyledSpan>{mentor.company}</StyledSpan>
                                <StyledSpan>{mentor.job}</StyledSpan>
                              </StyledDiv>
                            </li>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </StyledUl>
          </Loading>
        </Wrapper>
      </DragDropContext>
      <SimpleModal
        open={modalOpen}
        setOpen={setModalOpen}
        modalBody={modalBody}
      />
    </div>
  );
}

export default NewClassMentorProject;
