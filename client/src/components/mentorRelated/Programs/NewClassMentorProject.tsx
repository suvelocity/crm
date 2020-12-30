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
import {
  Button,
  TextField,
  Switch,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import network from "../../../helpers/network";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { IStudent, IClass, IMentor } from "../../../typescript/interfaces";
import { capitalize } from "../../../helpers/general";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useHistory, useLocation } from "react-router-dom";
import SimpleModal from "../Modal";
import Modal from "@material-ui/core/Modal";
import Swal from "sweetalert2";
import { StudentRoutes } from "../../../routes";
import { fixedPairing } from "../PairingByDistance";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

function NewClassMentorProject() {
  const [students, setStudents] = useState<Omit<IStudent, "Class">[]>([]);
  const [filteredCls, setFilteredCls] = useState<Omit<IStudent, "Class">[]>(
    students
  );
  const [available, setAvailble] = useState<boolean | string>(true);
  const [mentors, setMentors] = useState<IMentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<IMentor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchValueStudent, setSearchValueStudent] = useState<string>("");
  const { id } = useParams();
  const history = useHistory();
  let query = useLocation().search.split("=")[1];

  const getClass = useCallback(async () => {
    const { data }: { data: IClass } = await network.get(
      `/api/v1/M/classes/byId/${query}/${id}`
    );
    const newData = data.Students.map((student) => {
      student.mentor = student.MentorStudents![0]
        ? student.MentorStudents![0].Mentor
        : null;
      return student;
    });
    setStudents(newData);
    setLoading(false);
  }, [query, setLoading, setStudents, id]);

  const getMentors = useCallback(async () => {
    console.log(students);
    const { data }: { data: IMentor[] } = await network.get(`/api/v1/M/mentor`);
    const mentorList = data.map((mentor) => {
      let count = 0;
      students.forEach((student: Omit<IStudent, "Class">) => {
        if (student.mentor) {
          if (student.mentor?.id === mentor.id) count++;
        }
      });
      mentor.student = count;
      return mentor;
    });
    setMentors(mentorList);
    setLoading(false);
  }, [students]);

  useEffect(() => {
    try {
      getClass();
    } catch (e) {
      console.log(e.message);
    }
    //eslint-disable-next-line
  }, [getClass]);

  useEffect(() => {
    try {
      getMentors();
    } catch (e) {
      console.log(e.message);
    }
    //eslint-disable-next-line
  }, [getMentors]);

  useEffect(() => {
    const relevant =
      available === "all"
        ? mentors
        : mentors.filter((mentor) => mentor.available === available);
    if (searchValue !== "") {
      setFilteredMentors(
        relevant.filter(
          (mentor) =>
            mentor.name
              .toLocaleLowerCase()
              .includes(searchValue.toLocaleLowerCase()) ||
            mentor.address
              .toLocaleLowerCase()
              .includes(searchValue.toLocaleLowerCase()) ||
            mentor.company
              .toLocaleLowerCase()
              .includes(searchValue.toLocaleLowerCase()) ||
            mentor.role
              .toLocaleLowerCase()
              .includes(searchValue.toLocaleLowerCase())
        )
      );
    } else {
      setFilteredMentors(relevant);
    }
  }, [searchValue, mentors, available]);

  useEffect(() => {
    if (searchValueStudent !== "" && students) {
      console.log(searchValueStudent);
      setFilteredCls(
        students!.filter(
          (student) =>
            student.firstName
              .toLocaleLowerCase()
              .includes(searchValueStudent.toLocaleLowerCase()) ||
            student.lastName
              .toLocaleLowerCase()
              .includes(searchValueStudent.toLocaleLowerCase()) ||
            student.address
              .toLocaleLowerCase()
              .includes(searchValueStudent.toLocaleLowerCase())
        )
      );
    } else {
      setFilteredCls(students);
    }
  }, [searchValueStudent, students]);

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
      const itemsMentor: IMentor[] = Array.from(filteredMentors || []);
      const itemsStudents: Omit<IStudent, "Class">[] = Array.from(
        filteredCls || []
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
      const newMentors = Array.from(mentors)
      const mentorIndex = newMentors.findIndex(mentor => mentor.id === itemsMentor[result.source.index].id)
      newMentors[mentorIndex] = itemsMentor[result.source.index]
      setFilteredCls(itemsStudents);
      setMentors(newMentors);
      // setSearchValue("");
      // setSearchValueStudent("");
    }
  };

  const removeMentor = (mentor: IMentor, i: number) => {
    const newMentors: IMentor[] = Array.from(mentors);
    const mentorI: number = newMentors.findIndex((m) => m.id === mentor.id);
    if (mentorI > -1) {
      if (newMentors[mentorI].student !== 0) {
        newMentors[mentorI].student = newMentors[mentorI].student! - 1;
      }
    } else newMentors.push(mentor);
    setMentors(newMentors);
    const newCls: Omit<IStudent, "Class">[] = Array.from(students);
    const studentIndex = newCls.findIndex(old => old.id === filteredCls[i].id)
    newCls[studentIndex].mentor = null
    setStudents(newCls);
  };

  const availableSort = () => {
    // @ts-ignore
    const newCls: Omit<IStudent, "Class">[] = Array.from(students);
    newCls.sort((a, b) => {
      return a.mentor ? 1 : -1;
    });
    console.log(newCls);
    setStudents(newCls);
  };

  const saveMentor = async (student: Omit<IStudent, "Class">) => {
    try {
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
      }
    } catch {
      return student.firstName + student.lastName;
    }
  };

  const promptAreYouSure: () => Promise<boolean> = async () => {
    const newMentorsToDb = students.filter((student) => student.mentor);
    const dontHaveMentor = students.filter((student) => !student.mentor);
    return Swal.fire({
      title: "Are you sure?",
      text: `${dontHaveMentor.length} students in this class not linked to a mentor
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

  const promptRandomAssign: () => Promise<boolean> = async () => {
    return Swal.fire({
      title: "Something went wrong...",
      text: `Would you like to assign mentors randomly?`,
      icon: "error",
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
      const newMentorsToDb = students.filter(
        (student) => student.mentor || student.MentorStudents![0]
      );
      const dontHaveMentor = students.filter((student) => !student.mentor);
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

  const resetMentors = () => {
    getClass();
  };

  const changeSearchValue = (value: string) => {
    setSearchValue(value);
  };

  const changeSearchValueStudent = (value: string) => {
    setSearchValueStudent(value);
  };

  const addressGenerator = async () => {
    if (students) {
      const emptyMentors: IMentor[] = filteredMentors.filter(
        (mentor) => !mentor.student || mentor.student === 0
      );
      const emptyStudents = filteredCls.filter((student) => !student.mentor);
      // const studentsWithMentor = filteredCls.filter((student) => student.mentor);
      const newMentors: IMentor[] = Array.from(filteredMentors);
      const newStudents: Omit<IStudent, "Class">[] = Array.from(students);
      try {
        const pairs = await fixedPairing(emptyStudents, emptyMentors);
        pairs &&
          pairs.forEach((student) => {
            const studentIndex = newStudents.findIndex(old => old.id === student.id)
            newStudents[studentIndex] = student
            const currMentor = student.mentor;
            const mentorIndex = newMentors.findIndex(
              (mentor: IMentor) => mentor.id === currMentor?.id
            );
            if (mentorIndex > -1) {
              newMentors[mentorIndex].student
                ? newMentors[mentorIndex].student!++
                : (newMentors[mentorIndex].student = 1);
            }
          });
        setMentors(newMentors);
        pairs.sort((a, b) => a.id - b.id);
        setStudents(newStudents);
      } catch (error) {
        const proceed = await promptRandomAssign();
        if (!proceed) return;
        newMentors.sort((a, b) => {
          if (!a.student || !b.student) return 1;
          return a.student - b.student;
        });
        for (
          let i = 0;
          i < newMentors.length &&
          i < emptyStudents.length &&
          newMentors[i].student !== 1;
          i++
        ) {
          emptyStudents[i].mentor = newMentors[i];
          newMentors[i].student = 1;
        }
        setStudents(newStudents);
        setMentors(newMentors);
      }
    }
  };

  const changeAvailabilityOfMentor = async (
    id: number | undefined,
    currentAvailability: boolean
  ): Promise<void> => {
    if (id) {
      await network.put(`/api/v1/M/mentor/${id}`, {
        available: !currentAvailability,
      });
      getMentors();
    }
  };

  // useEffect(() => {
  //   const relevant = mentors.filter(mentor => mentor.available === available)
  //   setFilteredMentors(relevant)
  // },[available, mentors])

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ display: "flex", justifyContent: "space-around", gap: 20 }}>
        {" "}
        <Button
          color="primary"
          variant="contained"
          style={{ marginTop: 20, minWidth: 150 }}
          onClick={async () => await addressGenerator()}
        >
          Auto assign
        </Button>
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
        <Button
          color="secondary"
          variant="contained"
          style={{ marginTop: 20, minWidth: 150 }}
          onClick={resetMentors}
        >
          Reset
        </Button>
      </div>
      <div style={{ display: "flex" }}>
        <DragDropContext onDragEnd={onDropLeftEnd}>
          <Wrapper width="35%">
            <Center>
              <TitleWrapper>
                <H1 color={"#c47dfa"}>Students In Class</H1>
              </TitleWrapper>
            </Center>
            <br />
            <Loading loading={loading} size={30}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <TextField
                  label="Search"
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    changeSearchValueStudent(e.target.value as string);
                  }}
                  value={searchValueStudent}
                />

                <div style={{ display: "flex",flexDirection: "column", justifyContent: "space-between" }}>
                  <StyledSpan>sort</StyledSpan>
                  <ExpandMoreIcon
                    style={{ cursor: "pointer" }}
                    onClick={availableSort}
                  />
                </div>
              </div>
              <StyledUl>
                {students && (
                  <li>
                    <TableHeader repeatFormula="0.4fr 1fr 1fr 1fr">
                      <PersonIcon />
                      <StyledSpan weight="bold">Name</StyledSpan>
                      <StyledSpan weight="bold">Address</StyledSpan>
                      <StyledSpan weight="bold">Mentor</StyledSpan>
                    </TableHeader>
                  </li>
                )}
                {filteredCls && (
                  <div style={{ overflow: "scroll", maxHeight: 600 }}>
                    {filteredCls.map(
                      (student: Omit<IStudent, "Class">, i: number) => {
                        let color = student.mentor ? "#b5e8ca" : "#b5b5b5";
                        return (
                          <li
                            key={student.id}
                            style={{ backgroundColor: color }}
                          >
                            {/* <StyledLink color="black" to={`/student/${student.id}`}> */}
                            <StyledDiv repeatFormula="0.4fr 1fr 1fr 1.5fr">
                              <PersonIcon />
                              <StyledSpan weight="bold">
                                {capitalize(student.firstName)}{" "}
                                {capitalize(student.lastName)}
                              </StyledSpan>
                              <StyledSpan>{student.address}</StyledSpan>
                              <StyledSpan>
                                <Droppable
                                  droppableId={`${i}`}
                                  ignoreContainerClipping
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      {...provided.droppableProps}
                                      ref={provided.innerRef}
                                      style={{
                                        width: snapshot.isDraggingOver ? 0 : "",
                                      }}
                                    >
                                      {student.mentor && (
                                        <StyledDiv repeatFormula="2fr 0.5fr">
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
                  </div>
                )}
              </StyledUl>
            </Loading>
          </Wrapper>
          <Wrapper width="45%">
            <Center>
              <TitleWrapper>
                <H1 color={"#c47dfa"}>Mentors</H1>
              </TitleWrapper>
            </Center>
            <br />
            <Loading loading={loading} size={30}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <TextField
                  label="Search"
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    changeSearchValue(e.target.value as string);
                  }}
                  value={searchValue}
                />
                <FormControl style={{ minWidth: 200, marginRight: 20 }}>
                  <InputLabel>Availability</InputLabel>
                  <Select
                    onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                      setAvailble(e.target.value as boolean)
                    }
                  >
                    {/* <MenuItem value={true}>Available</MenuItem>
                    <MenuItem value={false}>Not available</MenuItem> */}
                    <MenuItem value="all">All</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <StyledUl>
                <li>
                  <TableHeader repeatFormula="0.5fr 1fr 1fr 1fr 1.25fr 1.25fr 1fr">
                    <PersonIcon />
                    <StyledSpan weight="bold">Name</StyledSpan>
                    <StyledSpan weight="bold">Address</StyledSpan>
                    <StyledSpan weight="bold">company</StyledSpan>
                    <StyledSpan weight="bold">role</StyledSpan>
                    <StyledSpan weight="bold">experience</StyledSpan>
                    <StyledSpan weight="bold">available</StyledSpan>
                  </TableHeader>
                </li>
                <Droppable droppableId="mentors">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {filteredMentors && (
                        <div style={{ overflow: "scroll", maxHeight: 600 }}>
                          {filteredMentors.sort(
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
                                    <StyledDiv repeatFormula="0.5fr 1fr 1fr 1fr 1.5fr 1fr 1fr">
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
                                      <StyledSpan>
                                        {mentor.experience}
                                      </StyledSpan>
                                      <StyledSpan>
                                        <Switch
                                          checked={mentor.available}
                                          onChange={() =>
                                            changeAvailabilityOfMentor(
                                              mentor?.id,
                                              mentor.available
                                            )
                                          }
                                          color="primary"
                                          name="checkedB"
                                          inputProps={{
                                            "aria-label": "primary checkbox",
                                          }}
                                        />
                                      </StyledSpan>
                                    </StyledDiv>
                                  </li>
                                )}
                              </Draggable>
                            ))}
                        </div>
                      )}
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
