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
import { IStudent, IEvent } from "../../typescript/interfaces";
import DateRangeIcon from "@material-ui/icons/DateRange";
import BusinessIcon from "@material-ui/icons/Business";
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
  const [student, setStudent] = useState<IStudent | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [eventsToMap, setEventsToMap] = useState<IEvent[]>([]);
  const { id } = useParams();

  const getStudent = useCallback(async () => {
    const { data }: { data: IStudent } = await network.get(
      `/api/v1/student/byId/${id}`
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
  }, [id, setStudent, setLoading, setEventsToMap]);

  const removeJob = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      jobId: number
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
          await network.patch("/api/v1/event/delete", {
            studentId: student?.id!,
            jobId,
          });
          getStudent();
        }
      });
    },
    [setStudent, id, student, getStudent]
  );

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
            <H1>Student Info</H1>
          </TitleWrapper>
        </Center>
        <Loading size={30} loading={loading}>
          <GridDiv repeatFormula="1fr 1fr 1fr">
            <List>
              {/* {Name} */}
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Name"
                  secondary={
                    capitalize(student?.firstName) +
                    " " +
                    capitalize(student?.lastName)
                  }
                />
              </ListItem>
              {/* Email */}
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText primary="Email" secondary={student?.email} />
              </ListItem>
              {/* Phone number */}
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Phone Number"
                  secondary={formatPhone(student?.phone)}
                />
              </ListItem>
              {/* Id number */}
              <ListItem>
                <ListItemIcon>
                  <DialpadIcon />
                </ListItemIcon>
                <ListItemText
                  primary="ID Number"
                  secondary={student?.idNumber}
                />
              </ListItem>
              {/* Military Service */}
              {student?.militaryService && (
                <MultilineListItem>
                  <ListItemIcon>
                    <TrackChangesIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Military Service"
                    secondary={capitalize(student?.militaryService)}
                  />
                </MultilineListItem>
              )}
            </List>
            <List>
              {/* Age */}
              <ListItem>
                <ListItemIcon>
                  <DateRangeIcon />
                </ListItemIcon>
                <ListItemText primary="Age" secondary={student?.age} />
              </ListItem>
              {/* Address */}
              <ListItem>
                <ListItemIcon>
                  <BusinessIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Address"
                  secondary={capitalize(student?.address)}
                />
              </ListItem>
              {/* Marital Status */}
              <ListItem>
                <ListItemIcon>
                  <FavoriteIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Marital Status"
                  secondary={capitalize(student?.maritalStatus)}
                />
              </ListItem>
              {/* Children */}
              <ListItem>
                <ListItemIcon>
                  <ChildFriendlyIcon />{" "}
                </ListItemIcon>
                <ListItemText
                  primary="Children"
                  secondary={student?.children}
                />
              </ListItem>
              {/* Work Experience */}
              <ListItem>
                <ListItemIcon>
                  <WorkIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Work Experience"
                  secondary={capitalize(student?.workExperience)}
                />
              </ListItem>
            </List>
            <List>
              {/* Citizenships */}
              <ListItem>
                <ListItemIcon>
                  <LanguageIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Citizenships"
                  secondary={capitalize(student?.citizenship)}
                />
              </ListItem>
              {/* Languages */}
              <ListItem>
                <ListItemIcon>
                  <TranslateIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Languages"
                  secondary={capitalize(student?.languages)}
                />
              </ListItem>
              {/* Course */}
              <ListItem>
                <ListItemIcon>
                  <ClassIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Course"
                  secondary={capitalize(student?.Class.name)}
                />
              </ListItem>
              {/* Academib Background */}
              {student?.academicBackground && (
                <MultilineListItem>
                  <ListItemIcon>
                    <AccountBalanceIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Academic Background"
                    secondary={capitalize(student?.academicBackground)}
                  />
                </MultilineListItem>
              )}

              {/* Additional Details */}
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
          </GridDiv>
        </Loading>
      </Wrapper>

    </>
  );
}

export default SingleMentor;