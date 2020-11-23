import React, { useState, useEffect } from "react";
import network from "../../helpers/network";
import {
  H1,
  Wrapper,
  TitleWrapper,
  StyledLink,
  Center,
} from "../../styles/styledComponents";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import WorkIcon from "@material-ui/icons/Work";
import { IJob } from "../../typescript-utils/interfaces";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import PostAddIcon from "@material-ui/icons/PostAdd";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import BusinessIcon from "@material-ui/icons/Business";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import ListItemIcon from "@material-ui/core/ListItemIcon";

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
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  })
);

function AllJobs() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const classes = useStyles();

  useEffect(() => {
    (async () => {
      const { data } = await network.get("/api/v1/job/all");
      setJobs(data);
      setLoading(false);
    })();
  }, []);

  return (
    <Wrapper>
      <Center>
        <TitleWrapper>
          <H1 color="red">All Jobs</H1>
        </TitleWrapper>
        <br />
        <StyledLink to="/job/add">
          <Button
            style={{ backgroundColor: "#bb4040", color: "white" }}
            variant="contained"
          >
            Add Job
          </Button>
        </StyledLink>
      </Center>
      <br />
      <Loading loading={loading} size={30}>
        {jobs &&
          jobs.map((job) => (
            <Accordion key={job.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-label="Expand"
                aria-controls="additional-actions2-content"
                id="additional-actions2-header"
              >
                <WorkIcon />
                <Typography className={classes.heading}>
                  <StyledLink
                    to={`/job/${job.id}`}
                    textDecoration={"true"}
                    color="black"
                  >
                    {job.position}
                  </StyledLink>
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  {job.company}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <PostAddIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Position"}
                      secondary={job.position}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationCityIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Company"} secondary={job.company} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BusinessIcon />
                    </ListItemIcon>
                    <ListItemText primary="Location" secondary={job.location} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PlaylistAddCheckIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Requirements"
                      secondary={job.requirements}
                    />
                  </ListItem>
                  {/* {job.students.map(
                    (student: Partial<IStudent>, index: number) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`Student ${index + 1}`}
                          secondary={`${student.firstName} ${student.lastName}`}
                        />
                      </ListItem>
                    )
                  )} */}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
      </Loading>
    </Wrapper>
  );
}

export default AllJobs;
