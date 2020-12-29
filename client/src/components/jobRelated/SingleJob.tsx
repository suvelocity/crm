import React, { useCallback, useEffect, useState } from "react";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Modal from "@material-ui/core/Modal";
import EditIcon from "@material-ui/icons/Edit";
import AddJob from "./AddJob";
import {
  H1,
  Wrapper,
  TitleWrapper,
  Center,
  GridDiv,
  StyledSpan,
  TableHeader,
  StyledUl,
  StyledDiv,
  StyledLink,
  MultilineListItem,
  EditDiv,
} from "../../styles/styledComponents";
import { SingleListItem } from "../tableRelated";
import {
  Person as PersonIcon,
  Description as DescriptionIcon,
  ContactSupport as ContactSupportIcon,
  PlaylistAddCheck as PlaylistAddCheckIcon,
  Business as BusinessIcon,
  LocationCity as LocationCityIcon,
  PostAdd as PostAddIcon,
} from "@material-ui/icons";
import { useParams } from "react-router-dom";
import network from "../../helpers/network";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { IJob, IEvent } from "../../typescript/interfaces";
import ApplyForJobModal from "./ApplyForJobModal";
import Swal from "sweetalert2";
import { capitalize, formatToIsraeliDate } from "../../helpers";

function SingleJob() {
  const [job, setJob] = useState<IJob | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [modalState, setModalState] = useState(false);
  const [eventsToMap, setEventsToMap] = useState<IEvent[]>([]);
  const { id } = useParams();

  const getJob = useCallback(async () => {
    const { data }: { data: IJob } = await network.get(
      `/api/v1/job/byId/${id}`
    );
    const uniqueStudents: IEvent[] = [];
    const sortedEvents = data.Events.sort(
      (e1: IEvent, e2: IEvent) =>
        new Date(e2.date).valueOf() - new Date(e1.date).valueOf()
    );
    sortedEvents.forEach((event: IEvent) => {
      if (
        !uniqueStudents.find(
          (ev: IEvent) => ev.Student!.id === event.Student!.id
        )
      ) {
        uniqueStudents.push(event);
      }
    });
    setEventsToMap(uniqueStudents);
    setJob(data);
    setLoading(false);
  }, [id, setJob, setLoading, setEventsToMap]);

  const handleClose = () => {
    setModalState(false);
    setLoading(true);
    getJob();
  };

  const removeStudents = useCallback(
    async (
      studentId: number,
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
          await network.put("/api/v1/event/delete", {
            userId: studentId,
            relatedId: job?.id,
          });
          getJob();
        }
      });
    },
    [setJob, id, job, getJob]
  );

  useEffect(() => {
    try {
      getJob();
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
    //eslint-disable-next-line
  }, [id]);

  const addEventToLog: (newEvent: IEvent) => void = (newEvent: IEvent) => {
    const sortedEvents = eventsToMap
      ?.concat(newEvent)
      .sort(
        (a: IEvent, b: IEvent) =>
          new Date(a.date).getMilliseconds() -
          new Date(b.date).getMilliseconds()
      );
    setEventsToMap(sortedEvents);
  };

  const tableRepeatFormula = "0.7fr 1.2fr 1.8fr 1.6fr 2.2fr";
  return (
    <>
      <Wrapper width='80%'>
        <Center>
          <TitleWrapper>
            <H1 color='#bb4040'>Job Info</H1>
          </TitleWrapper>
        </Center>
        <Loading size={30} loading={loading}>
          <EditDiv id="editJobButton" onClick={() => setModalState(true)}>
            <EditIcon />
          </EditDiv>
          <GridDiv repeatFormula='1fr 1fr 1fr 1fr'>
            <List>
              <SingleListItem
                primary='Position'
                secondary={capitalize(job?.position)}
              >
                <PostAddIcon />
              </SingleListItem>

              {/* Position */}
            </List>
            <List>
              <SingleListItem
                primary='Company'
                secondary={capitalize(job?.Company?.name)}
              >
                <BusinessIcon />
              </SingleListItem>
            </List>
            {/* Company */}
            <List>
              <SingleListItem
                primary='Location'
                secondary={capitalize(job?.location)}
              >
                <BusinessIcon />
              </SingleListItem>
            </List>
            <List>
              {/* Location */}
              <SingleListItem
                primary='Contact'
                secondary={capitalize(job?.contact)}
              >
                <PersonIcon />
              </SingleListItem>
              {/* Contact */}
            </List>
          </GridDiv>
          {job?.description && (
            <MultilineListItem>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText
                primary='Description'
                secondary={capitalize(job?.description)}
              />
            </MultilineListItem>
          )}
          {/* Description */}
          {job?.requirements && (
            <MultilineListItem>
              <ListItemIcon>
                <PlaylistAddCheckIcon />
              </ListItemIcon>
              <ListItemText
                primary='Requirements'
                secondary={capitalize(job?.requirements)}
              />
            </MultilineListItem>
          )}
          {/* Requirements */}
          {job?.additionalDetails && (
            <MultilineListItem>
              <ListItemIcon>
                <ContactSupportIcon />
              </ListItemIcon>
              <ListItemText
                primary='Additional Details'
                secondary={capitalize(job?.additionalDetails)}
              />
            </MultilineListItem>
          )}
          <Modal
            open={modalState}
            onClose={() => setModalState(false)}
            style={{ overflow: "scroll" }}
            aria-labelledby='simple-modal-title'
            aria-describedby='simple-modal-description'
          >
            {!job ? (
              <div>oops</div>
            ) : (
              <AddJob
                handleClose={handleClose}
                update={true}
                job={job}
                header='Edit Job'
              />
            )}
          </Modal>
          {/* Additional Details */}
        </Loading>
      </Wrapper>
      <Wrapper width='75%'>
        <Center>
          <TitleWrapper>
            <H1 color='#bb4040'>Applicants In Process</H1>
          </TitleWrapper>
        </Center>
        <br />
        <Loading loading={loading} size={30}>
          <StyledUl>
            {eventsToMap && (
              <li>
                {/* <TableHeader repeatFormula="0.7fr 2.2fr 1.5fr 2fr 2.2fr"> */}
                <TableHeader repeatFormula={tableRepeatFormula}>
                  <PersonIcon />
                  <StyledSpan weight='bold'>Name</StyledSpan>
                  <StyledSpan weight='bold'>Class</StyledSpan>
                  <StyledSpan weight='bold'>Email</StyledSpan>
                  <StyledSpan weight='bold'>Status</StyledSpan>
                </TableHeader>
              </li>
            )}
            {eventsToMap &&
              eventsToMap.map((event: IEvent) => (
                <li key={event.Student?.id}>
                  <StyledLink
                    color='black'
                    to={`/process/${event.Student?.id}/${job?.id}`}
                  >
                    <StyledDiv repeatFormula={tableRepeatFormula}>
                      <PersonIcon />
                      <StyledSpan weight='bold'>
                        {capitalize(event.Student?.firstName)}{" "}
                        {capitalize(event.Student?.lastName)}
                      </StyledSpan>
                      <StyledSpan>
                        {`${capitalize(
                          event.Student?.Class.name
                        )} (${capitalize(event.Student?.Class.course)} - ${
                          event.Student?.Class.cycleNumber
                        })`}
                      </StyledSpan>
                      <StyledSpan>{event.Student?.email}</StyledSpan>
                      <StyledSpan>{`${capitalize(
                        event.eventName
                      )}, as of ${formatToIsraeliDate(
                        event.date
                      )}`}</StyledSpan>
                    </StyledDiv>
                  </StyledLink>
                </li>
              ))}
          </StyledUl>

          <br />
          <Center>
            <ApplyForJobModal
              currentStudents={job?.Events.map(
                (event: IEvent) => event.Student!.id
              )}
              jobId={job?.id}
              getJob={getJob}
            />
          </Center>
        </Loading>
      </Wrapper>
    </>
  );
}

export default SingleJob;
