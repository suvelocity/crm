import React, { useState, useEffect } from "react";
import network from "../../helpers/network";
import {
  H1,
  Wrapper,
  TitleWrapper,
  StyledLink,
  Center,
  StyledSpan,
  StyledUl,
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
import styled from "styled-components";

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
    <Wrapper width="80%">
      <Center>
        <TitleWrapper>
          <H1 color="#bb4040">All Jobs</H1>
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
        <StyledUl>
          {jobs && (
            <li>
              <TableHeader>
                <WorkIcon />
                <StyledSpan weight="bold">company</StyledSpan>
                <StyledSpan weight="bold">position</StyledSpan>
                <StyledSpan weight="bold">location</StyledSpan>
              </TableHeader>
            </li>
          )}
          {jobs &&
            jobs.map((job) => (
              <li>
                <StyledLink
                  to={`/job/${job.id}`}
                  textDecoration={"true"}
                  color="black"
                >
                  <StyledDiv>
                    <WorkIcon />
                    <StyledSpan weight="bold">{job.company}</StyledSpan>
                    <StyledSpan>{job.position}</StyledSpan>
                    <StyledSpan>{job.location}</StyledSpan>
                  </StyledDiv>
                </StyledLink>
              </li>
            ))}
        </StyledUl>
      </Loading>
    </Wrapper>
  );
}

export default AllJobs;

const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr 2.5fr 2.5fr 1fr;
  padding: 10px;
  align-items: center;
  background-color: rgba(180, 180, 180, 0.12);
  transition: 150ms;
  border-radius: 2px;
  margin: 2px;
  &:hover {
    background-color: rgba(201, 201, 201, 0.38);
  }
`;

const TableHeader = styled(StyledDiv)`
  background-color: rgba(20, 20, 25, 0.6);
  color: white;
  &:hover {
    background-color: rgba(20, 20, 25, 0.6);
  }
`;
