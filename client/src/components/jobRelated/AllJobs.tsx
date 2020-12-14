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
  TableHeader,
  StyledDiv,
  repeatFormula,
} from "../../styles/styledComponents";
import Button from "@material-ui/core/Button";
import WorkIcon from "@material-ui/icons/Work";
import { IJob } from "../../typescript/interfaces";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { capitalize } from "../../helpers/general";

function AllJobs() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const { data } = await network.get("/api/v1/job/all");
      setJobs(data);
      setLoading(false);
    })();
  }, []);

  return (
    <Wrapper width='80%'>
      <Center>
        <TitleWrapper>
          <H1 color='#bb4040'>All Jobs</H1>
        </TitleWrapper>
        <br />
        <StyledLink to='/job/add'>
          <Button
            style={{ backgroundColor: "#bb4040", color: "white" }}
            variant='contained'
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
              <TableHeader repeatFormula={repeatFormula}>
                <WorkIcon />
                <StyledSpan weight='bold'>Position</StyledSpan>
                <StyledSpan weight='bold'>Company</StyledSpan>
                <StyledSpan weight='bold'>Location</StyledSpan>
              </TableHeader>
            </li>
          )}
          {jobs &&
            jobs.map((job) => (
              <li>
                <StyledLink to={`/job/${job.id}`} color='black'>
                  <StyledDiv repeatFormula={repeatFormula}>
                    <WorkIcon />
                    <StyledSpan weight='bold'>
                      {capitalize(job.position)}
                    </StyledSpan>
                    <StyledSpan>{capitalize(job.Company?.name)}</StyledSpan>
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
