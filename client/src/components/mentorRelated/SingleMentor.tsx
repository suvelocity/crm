import React, { useCallback, useEffect, useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
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
} from "../../styles/styledComponents";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import DialpadIcon from "@material-ui/icons/Dialpad";
import ClassIcon from "@material-ui/icons/Class";
import { useParams } from "react-router-dom";
import network from "../../helpers/network";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { IStudent, IMentor, IEvent } from "../../typescript/interfaces";
import DateRangeIcon from "@material-ui/icons/DateRange";
import BusinessIcon from "@material-ui/icons/Business";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import WcIcon from "@material-ui/icons/Wc";
import ChildFriendlyIcon from "@material-ui/icons/ChildFriendly";
import FavoriteIcon from "@material-ui/icons/Favorite";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import LanguageIcon from "@material-ui/icons/Language";
import TranslateIcon from "@material-ui/icons/Translate";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import WorkIcon from "@material-ui/icons/Work";
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import { capitalize } from "../../helpers/general";
import Swal from "sweetalert2";
import { formatPhone, formatToIsraeliDate } from "../../helpers/general";

function SingleMentor() {
  const [mentor, setMentor] = useState<IMentor[] | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();

  const getStudent = useCallback(async () => {
    const { data }: { data: IMentor[] } = await network.get(
      `/api/v1/M/mentor/${id}`
    );
    setMentor(data);
    setLoading(false);
  }, [id, setMentor, setLoading]);

  useEffect(() => {
    try {
      getStudent();
    } catch (e) {
      console.log(e.message);
    }
    //eslint-disable-next-line
  }, []);

  return (
    <>
      <Wrapper width="80%">
        <Center>
          <TitleWrapper>
            <H1>Mentor Info</H1>
          </TitleWrapper>
        </Center>
        <Loading size={30} loading={loading}>
          {mentor && mentor[0] && (
            <GridDiv repeatFormula="1fr 1fr 1fr">
              <List>
                {/* {Name} */}
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Name"
                    secondary={capitalize(mentor[0]?.name)}
                  />
                </ListItem>
                {/* Email */}
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText primary="Email" secondary={mentor[0]?.email} />
                </ListItem>
                {/* Phone number */}
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone Number"
                    secondary={formatPhone(mentor[0]?.phone)}
                  />
                </ListItem>
                {/* Id number */}
                <ListItem>
                  <ListItemIcon>
                    <DialpadIcon />
                  </ListItemIcon>
                  <ListItemText primary="ID Number" secondary={mentor[0]?.id} />
                </ListItem>
              </List>
              <List>
                {/* Address */}
                <ListItem>
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Address"
                    secondary={capitalize(mentor[0]?.address)}
                  />
                </ListItem>
                {/* company */}
                <ListItem>
                  <ListItemIcon>
                    <WorkIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Company"
                    secondary={capitalize(mentor[0]?.company)}
                  />
                </ListItem>
                {/* job */}
                <ListItem>
                  <ListItemIcon>
                    <WorkIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Job"
                    secondary={capitalize(mentor[0]?.job)}
                  />
                </ListItem>
              </List>
              <List>
                {/* gender */}
                <ListItem>
                  <ListItemIcon>
                    <WcIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Gender"
                    secondary={capitalize(mentor[0]?.gender)}
                  />
                </ListItem>
                {/* Students */}
                {mentor[0]?.Students && (
                  <ListItem>
                    <ListItemIcon>
                      <AssignmentIndIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Students"
                      secondary={mentor[0]?.Students.map((student) => {
                        return (
                          capitalize(student.firstName) +
                          " " +
                          capitalize(student.lastName) +
                          " - " +
                          capitalize(student.Class!.name) +
                          ":" +
                          capitalize(`${student.Class!.cycleNumber}`)
                        );
                      })}
                    />
                  </ListItem>
                )}
              </List>
            </GridDiv>
          )}
        </Loading>
      </Wrapper>
    </>
  );
}

export default SingleMentor;
