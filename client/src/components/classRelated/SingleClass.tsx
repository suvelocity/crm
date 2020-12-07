import React, { useCallback, useEffect, useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
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
} from "../../styles/styledComponents";
import PersonIcon from "@material-ui/icons/Person";
import ClassIcon from "@material-ui/icons/Class";
import { useParams } from "react-router-dom";
import network from "../../helpers/network";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { IStudent, IClass } from "../../typescript/interfaces";
import LinkIcon from "@material-ui/icons/Link";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import { formatToIsraeliDate } from "../../helpers/general";
import { capitalize, formatPhone } from "../../helpers/general";

function SingleClass() {
  const [cls, setCls] = useState<IClass | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();

  const getClass = useCallback(async () => {
    const { data }: { data: IClass } = await network.get(
      `/api/v1/class/byId/${id}`
    );
    setCls(data);
    setLoading(false);
  }, [id, setLoading, setCls]);

  useEffect(() => {
    try {
      getClass();
    } catch (e) {
      console.log(e.message);
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
          <GridDiv repeatingFormula="1fr 1fr">
            <List>
              <ListItem>
                <ListItemIcon>
                  <ClassIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Name"
                  secondary={capitalize(cls?.name)}
                />
              </ListItem>
              {/* Name */}
              <ListItem>
                <ListItemIcon>
                  <CalendarTodayIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Starting Date"
                  secondary={formatToIsraeliDate(cls?.startingDate!)}
                />
              </ListItem>
              {/* Starting Date */}
              <ListItem>
                <ListItemIcon>
                  <RotateLeftIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Cycle Number"
                  secondary={cls?.cycleNumber}
                />
              </ListItem>
              {/* Cycle number */}
            </List>
            <List>
              <ListItem>
                <ListItemIcon>
                  <ClassIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Course"
                  secondary={capitalize(cls?.course)}
                />
              </ListItem>
              {/* Course */}
              <ListItem>
                <ListItemIcon>
                  <CalendarTodayIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Ending Date"
                  secondary={formatToIsraeliDate(cls?.endingDate!)}
                />
              </ListItem>
              {/* Ending date */}
              <ListItem>
                <ListItemIcon>
                  <LinkIcon />
                </ListItemIcon>
                <ListItemText primary="Zoom Link" secondary={cls?.zoomLink} />
              </ListItem>
              {/* Zoom link */}
            </List>
          </GridDiv>
          {cls?.additionalDetails && (
            <MultilineListItem>
              <ListItemIcon>
                <ContactSupportIcon />
              </ListItemIcon>
              <ListItemText
                primary="Additional Details"
                secondary={capitalize(cls?.additionalDetails)}
              />
            </MultilineListItem>
          )}
          {/* Additional Details */}
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
                <TableHeader repeatFormula="1fr 2.5fr 2.5fr 1fr">
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
                    <StyledDiv repeatFormula="1fr 2.5fr 2.5fr 1fr">
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
          {/* <br />
          <Center>
          </Center> */}
        </Loading>
      </Wrapper>
    </>
  );
}

export default SingleClass;
