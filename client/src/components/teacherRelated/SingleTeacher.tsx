import React, { useCallback, useEffect, useState } from "react";
import List from "@material-ui/core/List";
import Modal from "@material-ui/core/Modal";
import EditIcon from "@material-ui/icons/Edit";
import AddTeacher from "./AddTeacher";
import EmailIcon from "@material-ui/icons/Email";
import PhoneIcon from "@material-ui/icons/Phone";
import DialpadIcon from "@material-ui/icons/Dialpad";
import AllClasses from "../classRelated/AllClasses";
import {
  H1,
  Wrapper,
  TitleWrapper,
  Center,
  GridDiv,
  EditDiv,
} from "../../styles/styledComponents";
import { SingleListItem } from "../tableRelated";
import { Person as PersonIcon } from "@material-ui/icons";
import { useParams } from "react-router-dom";
import network from "../../helpers/network";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import {
  ITeacher,
  tempTeacherClass,
  IClass,
} from "../../typescript/interfaces";
import AssignTeacherModal from "./AssignTeacherModal";
import Swal from "sweetalert2";
import { capitalize, formatPhone } from "../../helpers";

function SingleTeacher() {
  const [teacher, setTeacher] = useState<ITeacher>();
  const [loading, setLoading] = useState<boolean>(true);
  const [modalState, setModalState] = useState(false);
  const [classes, setClasses] = useState<IClass[]>([]);
  const { id } = useParams();

  const getTeacher = useCallback(async () => {
    const { data }: { data: ITeacher } = await network.get(
      `/api/v1/teacher/byId/${id}`
    );
    const classes: tempTeacherClass[] = data.Classes || [];
    const classArray = classes.map((c: tempTeacherClass) => c.Class);
    setClasses(classArray);
    setTeacher(data);
    setLoading(false);
  }, [id, setTeacher, setLoading, setClasses]);

  const handleClose = () => {
    setModalState(false);
    setLoading(true);
    getTeacher();
  };

  const removeClass = useCallback(
    async (
      classId: number,
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.stopPropagation();
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result: { isConfirmed: boolean }) => {
        if (result.isConfirmed) {
          await network.delete(
            `/api/v1/event/RemoveTeacherFromClass/?classId=${classId}&&teacherId=${teacher?.id}`
          );
          setLoading(true);
          getTeacher();
        }
      });
    },
    [setTeacher, id, teacher, getTeacher]
  );

  useEffect(() => {
    try {
      getTeacher();
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
  }, [id]);

  const tableRepeatFormula = "0.7fr 1.2fr 1.8fr 1.6fr 2.2fr";
  return (
    <>
      <Wrapper width="80%">
        <Center>
          <TitleWrapper>
            <H1 color="#e2e600">Teacher Info</H1>
          </TitleWrapper>
        </Center>
        <Loading size={30} loading={loading}>
          <EditDiv id="editTeacherButton" onClick={() => setModalState(true)}>
            <EditIcon />
          </EditDiv>
          <GridDiv repeatFormula="1fr 1fr 1fr 1fr">
            <List>
              <SingleListItem
                primary="Name"
                secondary={
                  capitalize(teacher?.firstName) +
                  " " +
                  capitalize(teacher?.lastName)
                }
              >
                <PersonIcon />
              </SingleListItem>
              <SingleListItem primary="Email" secondary={teacher?.email}>
                <EmailIcon />
              </SingleListItem>
              <SingleListItem
                primary="Phone Number"
                secondary={formatPhone(teacher?.phone)}
              >
                <PhoneIcon />
              </SingleListItem>
              <SingleListItem primary="ID Number" secondary={teacher?.idNumber}>
                <DialpadIcon />
              </SingleListItem>
            </List>
          </GridDiv>
          <Modal
            open={modalState}
            onClose={() => setModalState(false)}
            style={{ overflow: "scroll" }}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            {!teacher ? (
              <div>oops</div>
            ) : (
              <AddTeacher
                handleClose={handleClose}
                update={true}
                teacher={teacher}
                header="Edit Teacher"
              />
            )}
          </Modal>
        </Loading>
      </Wrapper>
      <Loading size={30} loading={loading}>
        {teacher && (
          <AllClasses
            teacherClasses={classes}
            header="Assigned Classes"
            // removeClass={removeClass}
            applyModal={
              <AssignTeacherModal
                assignedClasses={classes}
                getTeacher={getTeacher}
                teacher={teacher}
                handleClose={handleClose}
              />
            }
          />
        )}
      </Loading>
    </>
  );
}

export default SingleTeacher;
