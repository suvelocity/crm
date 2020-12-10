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

function NewClassMentorProject() {
  const [cls, setCls] = useState<IClass | undefined>();
  const [mentors, setMentors] = useState<IMentor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();

  const getClass = useCallback(async () => {
    const { data }: { data: IClass } = await network.get(
      `/api/v1/class/byId/${id}`
    );
    setCls(data);
    setLoading(false);
  }, [id, setLoading, setCls]);

  const getMentors = useCallback(async () => {
    const { data }: { data: IMentor[] } = await network.get(
      `/api/v1/mentor/mentor`
    );
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
    console.log(result);
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
      const prevMentor: IMentor | null = itemsStudents[parseInt(destination.droppableId)]
        .mentor!;
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

  return (
    <div style={{ display: "flex" }}>
      <DragDropContext onDragEnd={onDropLeftEnd}>
        <Wrapper width="40%">
          <Center>
            <TitleWrapper>
              <H1 color={"#2c6e3c"}>
                Students In Class
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#2c6e3c",
                    color: "white",
                    marginLeft: 10,
                  }}
                >
                  create
                </Button>
              </H1>
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
              <H1 color={"#2c6e3c"}>Available Mentors</H1>
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
                                  to={`/mento/${mentor.id}`}
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
    </div>
  );
}

export default NewClassMentorProject;
