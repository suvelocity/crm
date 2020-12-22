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
} from "../../../styles/styledComponents";
import PersonIcon from "@material-ui/icons/Person";
import DeleteIcon from "@material-ui/icons/Delete";
import { Button, TextField } from "@material-ui/core";
import { useParams } from "react-router-dom";
import network from "../../../helpers/network";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { IStudent, IClass, IMentor } from "../../../typescript/interfaces";
import { capitalize } from "../../../helpers/general";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useHistory, useLocation } from "react-router-dom";
import SimpleModal from "../Modal";
import Modal from '@material-ui/core/Modal';
import Swal from "sweetalert2";
import { StudentRoutes } from "../../../routes";
import { fixedPairing } from '../PairingByDistance';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

function NewClassMentorProject() {
  const [cls, setCls] = useState<IClass | undefined>();
  const [mentors, setMentors] = useState<IMentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<IMentor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>('');
  const { id } = useParams();
  const history = useHistory();
  let query = useLocation().search.split("=")[1];

  // console.log(pairing(cls?.Students!, []))

  const getClass = useCallback(async () => {
    const { data }: { data: IClass } = await network.get(
      `/api/v1/M/classes/byId/${query}/${id}`
    );
    data.Students = data.Students.map((student) => {
      student.mentor = student.MentorStudents![0]
        ? student.MentorStudents![0].Mentor
        : null;
      return student;
    });
    setCls(data);
    setLoading(false);
  }, [query, setLoading, setCls, id]);

  const getMentors = useCallback(async (cls: IClass | undefined) => {
    const { data }: { data: IMentor[] } = await network.get(
      `/api/v1/M/mentor/available`
    );
    console.log(data);
    const mentorList = data.map((mentor) => {
      let count = 0;
      cls?.Students.forEach((student) => {
        if (student.MentorStudents![0]) {
          if (student.MentorStudents![0].mentorId === mentor.id) count++;
        }
      });
      mentor.student = count;
      return mentor;
    });
    console.log(mentorList);
    setMentors(mentorList);
    setLoading(false);
  }, []);

  useEffect(() => {
    try {
      getClass();
    } catch (e) {
      console.log(e.message);
    }
    //eslint-disable-next-line
  }, [getClass, getMentors]);

  useEffect(() => {
    try {
      getMentors(cls);
    } catch (e) {
      console.log(e.message);
    }
    //eslint-disable-next-line
  }, [cls, getMentors]);

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
      reorderedMentor.student
        ? (reorderedMentor.student = reorderedMentor.student + 1)
        : (reorderedMentor.student = 1);
      itemsMentor.push(reorderedMentor);
      const prevMentor: IMentor | null = itemsStudents[
        parseInt(destination.droppableId)
      ].mentor!;
      if (prevMentor) {
        const mentorI = itemsMentor.findIndex((m) => m.id === prevMentor.id);
        mentorI > -1
          ? (itemsMentor[mentorI].student = itemsMentor[mentorI].student! - 1)
          : itemsMentor.push(prevMentor);
      }
      itemsStudents[parseInt(destination.droppableId)].mentor = reorderedMentor;
      const newCls: IClass | undefined = cls;
      newCls!.Students = itemsStudents;
      setCls(newCls);
      setMentors(itemsMentor);
    }
  };

  const removeMentor = (mentor: IMentor, i: number) => {
    const newMentors: IMentor[] = Array.from(mentors);
    const mentorI: number = newMentors.findIndex((m) => m.id === mentor.id);
    if (mentorI > -1) {
      newMentors[mentorI].student = newMentors[mentorI].student! - 1;
    } else {
      newMentors.push(mentor);
    }
    setMentors(newMentors);
    const newCls: IClass | undefined = cls;
    newCls!.Students[i].mentor = null;
    // newCls!.Students.sort((a, b) => {
    //   return a.mentor ? 1 : -1;
    // });
    setCls(newCls);
  };

  // const availableSort = () => {
  //   console.log("here");
  //   const newCls: IClass | undefined = cls;
  //   newCls!.Students.sort((a, b) => {
  //     return a.mentor ? 1 : -1;
  //   });
  //   setCls(newCls)
  // }
  
  const saveMentor = async (student: Omit<IStudent, "Class">) => {
    try {    
      console.log("student", student);
      if (student.MentorStudents![0]) {
        if (student.mentor) {
          await network.put(
            `/api/v1/M/classes/${student.MentorStudents![0].id}`,
            {
              mentorProgramId: id,
              mentorId: student.mentor!.id,
              studentId: student.id,
            }
          );
        } else {
          await network.patch(
            `/api/v1/M/classes/${student.MentorStudents![0].id}`
          );
        }
        console.log("chandge");
      } else if (student.mentor) {
        await network.post(`/api/v1/M/classes`, {
          mentorProgramId: id,
          mentorId: student.mentor!.id,
          studentId: student.id,
        });

        console.log("post");
      }
    } catch {
      return student.firstName + student.lastName;
    }
  };

  const promptAreYouSure: () => Promise<boolean> = async () => {
    const newMentorsToDb = cls!.Students.filter((student) => student.mentor);
    const dontHaveMentor = cls!.Students.filter((student) => !student.mentor);
    return Swal.fire({
      title: "Are you sure?",
      text:
      `${dontHaveMentor.length} students in this class not linked to a mentor
      Would you like to link ${newMentorsToDb.length} students anyway?`,
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#2fa324",
      confirmButtonText: "continue",
    }).then((result) => {
      if (result.isConfirmed) return true;
      return false;
    });
  };

  const createProgram = async () => {
    try {
      const newMentorsToDb = cls!.Students.filter((student) => student.mentor || student.MentorStudents![0]);
      const dontHaveMentor = cls!.Students.filter((student) => !student.mentor);
      if (dontHaveMentor.length > 0) {
        const proceed: boolean = await promptAreYouSure();
        if (!proceed) return;
      }
      newMentorsToDb.forEach(async (student) => {
          await saveMentor(student);
      });
      history.push("/mentor");
    } catch (err) {
      console.log(err);
    }
  };

  const resetMentors = (mentorizeClass: IClass | undefined) => {
    getClass();
  };

  const changeSearchValue = (value: string) => {
    setSearchValue(value);
  };

  // const assignMentors = (mentorizeClass: IClass | undefined) => {
  //   const mentorNeededCount: number = mentorizeClass!.Students.filter(
  //     (student) => !(student.mentor || student.mentorId)
  //   ).length;
  //   if (mentorNeededCount <= mentors.length) {
  //     let mentorsCount: number = 0;
  //     for (let i = 0; i < mentorizeClass!.Students.length; i++) {
  //       const student = mentorizeClass!.Students[i];
  //       if (student.mentorId || student.mentor) continue;
  //       else {
  //         student.mentor = mentors[mentorsCount];
  //         mentorsCount++;
  //       }
  //     }
  //     setMentors(mentors.slice(-(mentors.length - mentorsCount)));
  //     setCls(mentorizeClass);
  //   } else console.log("not enough mentors");
  // };

  const addressGenerator = async () => {
    if (cls) {
      try {
        const newCls: IClass | undefined = cls;
        const emptyMentors: IMentor[] = mentors.filter(mentor => !mentor.student || mentor.student === 0)
        const newMentors: IMentor[] = Array.from(mentors)
        const studentsWithMentor = newCls.Students.filter(student => student.mentor)
        const students = newCls.Students.filter(student => !student.mentor)
        const pairs = await fixedPairing(students, emptyMentors)
        pairs && pairs.forEach(student => {
          const currMentor = student.mentor
          const mentorIndex = newMentors.findIndex((mentor: IMentor) => mentor.id === currMentor?.id)
          if (mentorIndex > -1) {
            newMentors[mentorIndex].student ? newMentors[mentorIndex].student!++ : newMentors[mentorIndex].student = 1
          }
        })
        console.log(newMentors)
        setMentors(newMentors)
        pairs.sort((a,b) => a.id -b.id)
        newCls!.Students = [...pairs, ...studentsWithMentor]
        console.log(newCls)
        setCls(newCls)
      } catch (error) {
        Swal.fire("Error Occurred", error.message, "error");
      }
      
    }
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div>
        {" "}
        <Button
          variant="contained"
          onClick={createProgram}
          style={{
            backgroundColor: "#c47dfa",
            color: "white",
            marginTop: 10,
            fontSize: "20px",
          }}
        >
          SAVE
        </Button>
      </div>
      <div style={{ display: "flex" }}>
        <DragDropContext onDragEnd={onDropLeftEnd}>
          <Wrapper width="40%">
            <Center>
              <TitleWrapper>
                <H1 color={"#c47dfa"}>
                  Students In Class
                </H1>
              </TitleWrapper>
              <div style={{ color: "red" }}>{error}</div>
        <Button color="secondary" variant="contained" onClick={() => resetMentors(cls)}>Reset</Button>
        <Button color="primary" variant="contained" onClick={async () => await addressGenerator()}>Generate</Button>
            </Center>
            <br />
            <Loading loading={loading} size={30}>
              <StyledUl>
                {cls?.Students && (
                  <li>
                    <TableHeader repeatFormula="0.4fr 1fr 1fr 1.5fr 0.05fr">
                      <PersonIcon />
                      <StyledSpan weight="bold">Name</StyledSpan>
                      <StyledSpan weight="bold">Address</StyledSpan>
                      <StyledSpan weight="bold">Select Mentor</StyledSpan>
                      <ExpandMoreIcon style={{cursor:"pointer"}} /*onClick={availableSort}*//>
                    </TableHeader>
                  </li>
                )}
                {cls?.Students &&
                  cls?.Students!.map(
                    (student: Omit<IStudent, "Class">, i: number) => {
                      console.log(student)
                      let color = student.mentor ? "#b5e8ca" : "#b5b5b5";
                      return (
                        <li key={student.id} style={{ backgroundColor: color }}>
                          {/* <StyledLink color="black" to={`/student/${student.id}`}> */}
                          <StyledDiv repeatFormula="0.4fr 1fr 1fr 1.5fr">
                            <PersonIcon />
                            <StyledSpan weight="bold">
                              {capitalize(student.firstName)}{" "}
                              {capitalize(student.lastName)}
                            </StyledSpan>
                            <StyledSpan>{student.address}</StyledSpan>
                            <StyledSpan>
                              <Droppable droppableId={`${i}`} ignoreContainerClipping>
                                {(provided, snapshot) => (
                                  <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={{ width: snapshot.isDraggingOver ? 0 : '' }}
                                  >
                                    {student.mentor && (
                                      <StyledDiv repeatFormula="1.5fr 1fr">
                                        <StyledSpan>
                                          {capitalize(student.mentor.name)}
                                        </StyledSpan>
                                        <Button
                                          onClick={() =>
                                            removeMentor(student.mentor!, i)
                                          }
                                        >
                                          <DeleteIcon />
                                        </Button>
                                      </StyledDiv>
                                    )}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </StyledSpan>
                          </StyledDiv>
                          {/* </StyledLink> */}
                        </li>
                      );
                    }
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
            <div>
            <TextField
              label='Search'
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                changeSearchValue(e.target.value as string);
              }}
            />
          </div>
              <StyledUl>
                <li>
                  <TableHeader repeatFormula="0.5fr 2fr 1fr 1fr 1fr 1fr">
                    <PersonIcon />
                    <StyledSpan weight="bold">Name</StyledSpan>
                    <StyledSpan weight="bold">Address</StyledSpan>
                    <StyledSpan weight="bold">company</StyledSpan>
                    <StyledSpan weight="bold">role</StyledSpan>
                    <StyledSpan weight="bold">experience</StyledSpan>
                  </TableHeader>
                </li>
                <Droppable droppableId="mentors">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {filteredMentors &&
                        filteredMentors.sort(
                          (a, b) => (a.student || 0) - (b.student || 0)
                        ) &&
                        filteredMentors.map((mentor, i) => (
                          <Draggable key={i} draggableId={`${i}`} index={i}>
                            {(provided) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <StyledDiv repeatFormula="0.5fr 1fr 1fr 1fr 1fr 1fr">
                                  <StyledSpan weight="bold">
                                    {mentor.student ? mentor.student : 0}
                                  </StyledSpan>
                                  <StyledLink
                                    to={`/mentor/${mentor.id}`}
                                    color="black"
                                  >
                                    <StyledSpan weight="bold">
                                      {capitalize(mentor.name)}
                                    </StyledSpan>
                                  </StyledLink>
                                  <StyledSpan>{mentor.address}</StyledSpan>
                                  <StyledSpan>{mentor.company}</StyledSpan>
                                  <StyledSpan>{mentor.role}</StyledSpan>
                                  <StyledSpan>{mentor.experience}</StyledSpan>
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
    </div>
  );
}

export default NewClassMentorProject;
