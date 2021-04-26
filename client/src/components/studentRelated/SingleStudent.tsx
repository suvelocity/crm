import React, { useCallback, useEffect, useState } from "react";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import EmailIcon from "@material-ui/icons/Email";
import {
  H1,
  Wrapper,
  TitleWrapper,
  Center,
  GridDiv,
  StyledLink,
  StyledDiv,
  TableHeader,
  StyledSpan,
  StyledUl,
  MultilineListItem,
  EditDiv,
} from "../../styles/styledComponents";
import PersonIcon from "@material-ui/icons/Person";
import BusinessIcon from "@material-ui/icons/Business";
import PhoneIcon from "@material-ui/icons/Phone";
import { camelCaseToWords, academicKeys } from "./AddStudent";
import DialpadIcon from "@material-ui/icons/Dialpad";
import ClassIcon from "@material-ui/icons/Class";
import ApplyStudentModal from "./ApplyStudentModal";
import { useParams, useHistory } from "react-router-dom";
import network from "../../helpers/network";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import {
  IStudent,
  IEvent,
  IAcademicBackground,
} from "../../typescript/interfaces";
import DateRangeIcon from "@material-ui/icons/DateRange";
import ChildFriendlyIcon from "@material-ui/icons/ChildFriendly";
import FavoriteIcon from "@material-ui/icons/Favorite";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import LanguageIcon from "@material-ui/icons/Language";
import TranslateIcon from "@material-ui/icons/Translate";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import WorkIcon from "@material-ui/icons/Work";
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import Modal from "@material-ui/core/Modal";
import EditIcon from "@material-ui/icons/Edit";
import AddStudent from "./AddStudent";
import {
  capitalize,
  fireSwalError,
  fireSwalSuccess,
  promptSwalConfirmation,
} from "../../helpers/general";
import { formatPhone, formatToIsraeliDate } from "../../helpers/general";
import { SingleListItem } from "../tableRelated";
import PostAddIcon from "@material-ui/icons/PostAdd";
import { Button } from "@material-ui/core";

function SingleStudent() {
  const [student, setStudent] = useState<IStudent | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [modalState, setModalState] = useState(false);
  const [eventsToMap, setEventsToMap] = useState<IEvent[]>([]);
  const { id } = useParams();
  const history = useHistory();

  const getStudent = useCallback(async () => {
    // try {
    const { data }: { data: IStudent } = await network.get(
      `/api/v1/student/byId/${id}?only=jobs`
    );
    const uniqueJobs: IEvent[] = [];
    const sortedEvents = data.Events.sort(
      (e1: IEvent, e2: IEvent) =>
        new Date(e2.date).valueOf() - new Date(e1.date).valueOf()
    );
    sortedEvents.forEach((event: IEvent) => {
      if (!uniqueJobs.find((ev: IEvent) => ev.Job!.id === event.Job!.id)) {
        uniqueJobs.push(event);
      }
    });
    setEventsToMap(uniqueJobs);
    setStudent(data);
    setLoading(false);
    // } catch (error) {
    //   alert(error.message);
    // }
  }, [id, setStudent, setLoading, setEventsToMap]);

  const handleClose = () => {
    setModalState(false);
    setLoading(true);
    getStudent();
  };

  // const removeJob = useCallback(
  //   async (
  //     e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  //     jobId: number
  //   ) => {
  //     e.stopPropagation();
  //     Swal.fire({
  //       title: "Are you sure?",
  //       text: "You won't be able to revert this!",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Yes, delete it!",
  //     }).then(async (result: { isConfirmed: boolean }) => {
  //       if (result.isConfirmed) {
  //         await network.patch("/api/v1/event/delete", {
  //           studentId: student?.id!,
  //           jobId,
  //         });
  //         getStudent();
  //       }
  //     });
  //   },
  //   [setStudent, id, student, getStudent]
  // );

  const deleteStudent: () => Promise<void> = async () => {
    try {
      const response: boolean = await promptSwalConfirmation(
        "Are you sure?",
        `Delete student ${capitalize(student?.firstName)} ${capitalize(
          student?.lastName
        )}`,
        "warning"
      );
      if (!response) return;
      console.log(id);

      const deleteMessage = await network.delete(`/api/v1/student/${id}`);
      await fireSwalSuccess(deleteMessage.data.message);

      history.push("/student/all");
    } catch (error) {
      console.log(error.message);
      fireSwalError("Could not delete student");
    }
  };

  useEffect(() => {
    getStudent().catch((error) => {
      console.log(error.message);
      setLoading(false);
      const reason =
        error.response.status === 404 ? "Not found" : "Internal Error";
      fireSwalError("Could not fetch student. " + reason);
      // TODO 404 page for student
    });
    //eslint-disable-next-line
  }, []);

  return (
    <>
      <Wrapper width="80%">
        <Center>
          <TitleWrapper>
            <H1>Student Info</H1>
          </TitleWrapper>
        </Center>
        <Loading size={30} loading={loading}>
          <EditDiv id="editStudentButton" onClick={() => setModalState(true)}>
            <EditIcon />
          </EditDiv>
          <GridDiv repeatFormula="1fr 1fr 1fr">
            <List>
              <SingleListItem
                primary="Name"
                secondary={
                  capitalize(student?.firstName) +
                  " " +
                  capitalize(student?.lastName)
                }
              >
                <PersonIcon />
              </SingleListItem>
              <SingleListItem primary="Email" secondary={student?.email}>
                <EmailIcon />
              </SingleListItem>
              <SingleListItem
                primary="Phone Number"
                secondary={
                  student?.phone ? formatPhone(student?.phone) : "לא ידוע"
                }
              >
                <PhoneIcon />
              </SingleListItem>
              <SingleListItem primary="ID Number" secondary={student?.idNumber}>
                <DialpadIcon />
              </SingleListItem>
              {student?.resumeLink && (
                <SingleListItem
                  primary="Resume Link"
                  secondary={student?.resumeLink}
                >
                  <PostAddIcon />
                </SingleListItem>
              )}
              <MultilineListItem>
                <ListItemIcon>
                  <TrackChangesIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Military Service"
                  secondary={
                    student?.militaryService
                      ? capitalize(student?.militaryService)
                      : "לא ידוע"
                  }
                />
              </MultilineListItem>
            </List>
            <List>
              <SingleListItem
                primary="Age"
                secondary={student?.age ? student.age : "לא ידוע"}
              >
                <DateRangeIcon />
              </SingleListItem>
              <SingleListItem
                primary="Address"
                secondary={capitalize(student?.address)}
              >
                <BusinessIcon />
              </SingleListItem>
              <SingleListItem
                primary="Marital Status"
                secondary={capitalize(student?.maritalStatus)}
              >
                <FavoriteIcon />
              </SingleListItem>
              <SingleListItem
                primary="Children"
                secondary={student?.children ? student.children : "אין"}
              >
                <ChildFriendlyIcon />
              </SingleListItem>
              {student?.additionalDetails && (
                <MultilineListItem>
                  <ListItemIcon>
                    <ContactSupportIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Additional Details"
                    secondary={capitalize(student?.additionalDetails)}
                  />
                </MultilineListItem>
              )}
            </List>
            <List>
              <SingleListItem
                primary="Citizenships"
                secondary={
                  student?.citizenship
                    ? capitalize(student?.citizenship)
                    : "לא ידוע"
                }
              >
                <LanguageIcon />
              </SingleListItem>
              <SingleListItem
                primary="Languages"
                secondary={
                  student?.languages
                    ? capitalize(student?.languages)
                    : "לא ידוע"
                }
              >
                <TranslateIcon />
              </SingleListItem>
              <SingleListItem
                primary="Class"
                secondary={`${capitalize(student?.Class.name)} (${capitalize(
                  student?.Class.course
                )} - ${student?.Class.cycleNumber})`}
              >
                <ClassIcon />
              </SingleListItem>
              <SingleListItem
                primary="Work Experience"
                secondary={
                  student?.workExperience
                    ? capitalize(student?.workExperience)
                    : "לא ידוע"
                }
              >
                <WorkIcon />
              </SingleListItem>
            </List>
          </GridDiv>
          {student?.AcademicBackgrounds &&
            student?.AcademicBackgrounds.length > 0 && (
              <div
                style={{
                  display: "flex",
                  width: "70%",
                  margin: "auto",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <h2>Academic Background</h2>
                {student?.AcademicBackgrounds.map(
                  (background: IAcademicBackground, index: number) => {
                    return (
                      <div
                        style={{
                          backgroundColor: "#bebbbb",
                          marginBottom: "10px",
                          borderRadius: "5px",
                          display: "flex",
                          width: "100%",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "30px",
                            fontWeight: "bold",
                            textAlign: "center",
                            width: "20%",
                          }}
                        >
                          {index + 1}
                        </div>
                        {academicKeys.map((key: string) => {
                          return (
                            <SingleListItem
                              primary={camelCaseToWords(key)}
                              //@ts-ignore
                              secondary={background[key]}
                            ></SingleListItem>
                          );
                        })}
                      </div>
                    );
                  }
                )}
              </div>
            )}
          <Modal
            open={modalState}
            onClose={handleClose}
            style={{ overflow: "scroll" }}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            {!student ? (
              <div>oops</div>
            ) : (
              <AddStudent
                handleClose={handleClose}
                update={true}
                student={student}
                header="Edit Student"
              />
            )}
          </Modal>
        </Loading>
      </Wrapper>
      <Wrapper width="65%">
        <Center>
          <TitleWrapper>
            <H1>Job Applications</H1>
          </TitleWrapper>
        </Center>
        <Loading loading={loading} size={30}>
          <StyledUl>
            <TableHeader repeatFormula="0.5fr 1.5fr 1.5fr 2fr">
              <WorkIcon />
              <StyledSpan weight="bold">Position</StyledSpan>
              <StyledSpan weight="bold">Company</StyledSpan>
              <StyledSpan weight="bold">Status</StyledSpan>
            </TableHeader>
            {eventsToMap.map((event: IEvent) => (
              <li>
                <StyledLink
                  color="black"
                  to={`/process/${student?.id}/${event.Job?.id}`}
                >
                  <StyledDiv repeatFormula="0.5fr 1.5fr 1.5fr 2fr">
                    <WorkIcon />
                    <StyledSpan weight="bold">
                      {capitalize(event.Job?.position)}
                    </StyledSpan>
                    <StyledSpan>
                      {capitalize(event.Job?.Company.name)}
                    </StyledSpan>
                    <StyledSpan>{`${capitalize(
                      event.eventName
                    )}, as of ${formatToIsraeliDate(event.date)}`}</StyledSpan>
                  </StyledDiv>
                </StyledLink>
              </li>
            ))}
          </StyledUl>
          <br />
          <Center>
            <ApplyStudentModal
              currentJobs={eventsToMap.map((event: IEvent) => event.Job!.id!)}
              studentId={student?.id}
              getStudent={getStudent}
            />
          </Center>
        </Loading>
      </Wrapper>
      {!loading && (
        <Center>
          <Button
            style={{
              color: "white",
              backgroundColor: "#fd3535",
              marginBottom: "3vh",
            }}
            variant={"contained"}
            onClick={deleteStudent}
          >
            <b>Delete Student</b>
          </Button>
        </Center>
      )}
    </>
  );
}

export default SingleStudent;
