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
  RemoveJobButton,
} from "../../styles/styledComponents";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import DialpadIcon from "@material-ui/icons/Dialpad";
import SubjectIcon from "@material-ui/icons/Subject";
import ClassIcon from "@material-ui/icons/Class";
import { useParams } from "react-router-dom";
import network from "../../helpers/network";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { IStudent, IJob } from "../../typescript/interfaces";
import DateRangeIcon from "@material-ui/icons/DateRange";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import PostAddIcon from "@material-ui/icons/PostAdd";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import BusinessIcon from "@material-ui/icons/Business";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import ApplyForJobModal from "./ApplyForJobModal";
import IconButton from "@material-ui/core/IconButton";
import Swal from "sweetalert2";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: "33.33%",
      flexShrink: 0,
      fontWeight: theme.typography.fontWeightBold,
      marginLeft: 10,
      marginTop: 3,
    },
    iconButton: {
      fontSize: theme.typography.pxToRem(10),
      padding: 0,
      marginLeft: "auto",
    },
  })
);

function SingleJob() {
  const [job, setJob] = useState<IJob | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();
  const classes = useStyles();

  const getJob = useCallback(async () => {
    const { data }: { data: IJob } = await network.get(
      `/api/v1/job/byId/${id}`
    );
    setJob(data);
    setLoading(false);
  }, [id, setJob, setLoading]);

  const removeStudents = useCallback(
    async (
      studentId: string,
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
      }).then(async (result) => {
        if (result.isConfirmed) {
          const { data: updated } = await network.patch(
            `/api/v1/job/modify-students/${id}`,
            {
              students: [studentId],
              method: "remove",
            }
          );
          setJob(updated);
        }
      });
    },
    [setJob, id]
  );

  useEffect(() => {
    try {
      getJob();
    } catch (e) {
      console.log(e.message);
    }
    //eslint-disable-next-line
  }, [id]);

  return (
    <>
      <Wrapper>
        <Center>
          <TitleWrapper>
            <H1 color='red'>Job Info</H1>
          </TitleWrapper>
        </Center>
        <Loading size={30} loading={loading}>
          <List>
            <ListItem>
              <ListItemIcon>
                <PostAddIcon />
              </ListItemIcon>
              <ListItemText primary='Position' secondary={job?.position} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LocationCityIcon />
              </ListItemIcon>
              <ListItemText primary='Company' secondary={job?.company} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText primary='Location' secondary={job?.location} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PlaylistAddCheckIcon />
              </ListItemIcon>
              <ListItemText
                primary='Requirements'
                secondary={job?.requirements}
              />
            </ListItem>
          </List>
        </Loading>
      </Wrapper>
      <Wrapper>
        <Center>
          <TitleWrapper>
            <H1 color='red'>Students In Process</H1>
          </TitleWrapper>
        </Center>
        <br />
        <Loading loading={loading} size={30}>
          {job?.students.map((student: Partial<IStudent>) => (
            <Accordion key={student.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-label='Expand'
                aria-controls='additional-actions2-content'
                id='additional-actions2-header'
              >
                <PersonIcon />
                <Typography className={classes.heading}>
                  {student.firstName} {student.lastName}
                </Typography>
                <Typography className={classes.iconButton}>
                  <IconButton
                    onClick={(
                      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ) => removeStudents(student.id!, e)}
                    style={{ padding: 0 }}
                  >
                    <RemoveJobButton />
                  </IconButton>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary='Name'
                      secondary={student.firstName + " " + student.lastName}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText primary='Email' secondary={student.email} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary='Phone Number'
                      secondary={student.phone}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DialpadIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary='ID Number'
                      secondary={student.idNumber}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <ClassIcon />
                    </ListItemIcon>
                    <ListItemText primary='Course' secondary={student.class} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DateRangeIcon />
                    </ListItemIcon>
                    <ListItemText primary='Age' secondary={student.age} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BusinessIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary='Address'
                      secondary={student.address}
                    />
                  </ListItem>
                  {student.additionalDetails && (
                    <ListItem>
                      <ListItemIcon>
                        <SubjectIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary='Additional Details'
                        secondary={student.additionalDetails}
                      />
                    </ListItem>
                  )}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
          <br />
          <Center>
            <ApplyForJobModal
              currentStudents={job?.students.map(
                (student: Partial<IStudent>) => student.id
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
