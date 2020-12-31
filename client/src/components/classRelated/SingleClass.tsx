import React, { useCallback, useEffect, useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Modal from "@material-ui/core/Modal";
import EditIcon from "@material-ui/icons/Edit";
import AddClass from "./AddClass";
import { SingleListItem } from "../tableRelated";
import {
  H1,
  Wrapper,
  TitleWrapper,
  Center,
  GridDiv,
  MultilineListItem,
  StyledSpan,
  TableHeader,
  StyledDiv,
  StyledUl,
  StyledLink,
  repeatFormula,
  EditDiv,
  RegisterToCM
} from "../../styles/styledComponents";
import {
  CalendarToday as CalendarTodayIcon,
  Link as LinkIcon,
  Person as PersonIcon,
  Class as ClassIcon,
  ContactSupport as ContactSupportIcon,
  Computer as ComputerIcon ,
} from "@material-ui/icons";
import { useParams } from "react-router-dom";
import network from "../../helpers/network";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { IStudent, IClass } from "../../typescript/interfaces";
import { capitalize, formatToIsraeliDate, formatPhone } from "../../helpers";
import Swal from "sweetalert2";

function SingleClass() {
  const [cls, setCls] = useState<IClass | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [modalState, setModalState] = useState(false);
  const { id } = useParams();

  const getClass = useCallback(async () => {
    const { data }: { data: IClass } = await network.get(
      `/api/v1/class/byId/${id}`
    );
    setCls(data);
    setLoading(false);
  }, [id, setLoading, setCls]);

  const connectToCM = async ()=>{
    try{
      const {data} = await network.post(`/api/v1/challengeMe/team/forClass/${id}`)
    }
    catch(e){
      console.log(e)
    }
  }

  const handleClose = () => {
    setModalState(false);
    setLoading(true);
    getClass();
  };

  useEffect(() => {
    try {
      getClass();
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
    //eslint-disable-next-line
  }, [getClass]);

  return (
    <>
      <Wrapper width="80%">
        <Center>
          <TitleWrapper>
            <H1 color="#2c6e3c">Class Info</H1>
          </TitleWrapper>
        </Center>
        <Loading size={30} loading={loading}>
          <EditDiv id="editClassButton" onClick={() => setModalState(true)}>
            <EditIcon />
          </EditDiv>
          {cls&&cls.cmId?
          <RegisterToCM  title="Connected to ChallengeMe">
            <ComputerIcon  style={{color:"green"}}/>
          </RegisterToCM>:
          <RegisterToCM  title="Class is not connected to ChallengeMe" onClick={() => connectToCM()}>
          <ComputerIcon  style={{color:"red",marginTop:"5px"}}/>
        </RegisterToCM>

          }
          <GridDiv repeatingFormula="1fr 1fr">
            <List>
              <SingleListItem primary="Name" secondary={capitalize(cls?.name)}>
                <ClassIcon />
              </SingleListItem>
              <SingleListItem
                primary="Starting Date"
                secondary={formatToIsraeliDate(cls?.startingDate!)}
              >
                <CalendarTodayIcon />
              </SingleListItem>
              <SingleListItem
                primary="Cycle Number"
                secondary={cls?.cycleNumber}
              >
                <CalendarTodayIcon />
              </SingleListItem>
            </List>
            <List>
              <SingleListItem
                primary="Course"
                secondary={capitalize(cls?.course)}
              >
                <CalendarTodayIcon />
              </SingleListItem>
              <ListItem>
                <ListItemIcon>
                  <CalendarTodayIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Ending Date"
                  secondary={formatToIsraeliDate(cls?.endingDate!)}
                />
              </ListItem>
              <SingleListItem
                primary="Zoom Link"
                secondary={cls?.zoomLink ? cls?.zoomLink : "לא ידוע"}
              >
                <LinkIcon />
              </SingleListItem>
            </List>
          </GridDiv>
          {cls?.additionalDetails && (
            <MultilineListItem>
              <SingleListItem
                primary="Additional Details"
                secondary={capitalize(cls?.additionalDetails)}
              >
                <ContactSupportIcon />
              </SingleListItem>
            </MultilineListItem>
          )}

          <Modal
            open={modalState}
            onClose={() => setModalState(false)}
            style={{ overflow: "scroll" }}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            {!cls ? (
              <div>oops</div>
            ) : (
              <AddClass
                handleClose={handleClose}
                update={true}
                cls={cls}
                header="Edit Class"
              />
            )}
          </Modal>
        </Loading>
      </Wrapper>
      <Wrapper width="50%">
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
                <TableHeader repeatFormula={repeatFormula}>
                  <PersonIcon />
                  <StyledSpan weight="bold">Name</StyledSpan>
                  <StyledSpan weight="bold">Email</StyledSpan>
                  <StyledSpan weight="bold">Phone</StyledSpan>
                </TableHeader>
              </li>
            )}
            {cls?.Students &&
              cls?.Students!.map((student: Omit<IStudent, "Class">) => (
                <li key={student.id}>
                  <StyledLink color="black" to={`/student/${student.id}`}>
                    <StyledDiv repeatFormula={repeatFormula}>
                      <PersonIcon />
                      <StyledSpan weight="bold">
                        {capitalize(student.firstName)}{" "}
                        {capitalize(student.lastName)}
                      </StyledSpan>
                      <StyledSpan>{student.email}</StyledSpan>
                      <StyledSpan>{formatPhone(student.phone)}</StyledSpan>
                    </StyledDiv>
                  </StyledLink>
                </li>
              ))}
          </StyledUl>
        </Loading>
      </Wrapper>
    </>
  );
}

export default SingleClass;
