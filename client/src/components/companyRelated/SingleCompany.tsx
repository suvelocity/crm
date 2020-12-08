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
import { ICompany, IJob } from "../../typescript/interfaces";
import LinkIcon from "@material-ui/icons/Link";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import { formatToIsraeliDate } from "../../helpers/general";
import { capitalize, formatPhone } from "../../helpers/general";

function SingleCompany() {
  const [company, setCompany] = useState<ICompany | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();

  const getCompany = useCallback(async () => {
    const { data }: { data: ICompany } = await network.get(
      `/api/v1/company/byId/${id}`
    );
    setCompany(data);
    setLoading(false);
  }, [id, setLoading, setCompany]);

  useEffect(() => {
    try {
      getCompany();
    } catch (e) {
      console.log(e.message);
    }
    //eslint-disable-next-line
  }, [getCompany]);

  return (
    <>
      <Wrapper width="80%">
        <Center>
          <TitleWrapper>
            <H1 color="#9e9e23">Company Info</H1>
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
                  secondary={capitalize(company?.name)}
                />
              </ListItem>
              {/* Name */}
              <ListItem>
                <ListItemIcon>
                  <LocationCityIcon />
                </ListItemIcon>
                <ListItemText
                  primary="location"
                  secondary={capitalize(company?.location)}
                />
              </ListItem>
              {/* Starting Date */}
              <ListItem>
                <ListItemIcon>
                  <RotateLeftIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Contact Name"
                  secondary={
                    company?.contactName
                      ? capitalize(company.contactName)
                      : "None"
                  }
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
                  primary="Contact Number"
                  secondary={
                    company?.contactNumber ? company.contactNumber : "None"
                  }
                />
              </ListItem>
              {/* Course */}
              <ListItem>
                <ListItemIcon>
                  <CalendarTodayIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Contact Position"
                  secondary={
                    company?.contactPosition
                      ? capitalize(company?.contactPosition)
                      : "None"
                  }
                />
              </ListItem>
              {/* Ending date */}
              {/* <ListItem>
                <ListItemIcon>
                  <LinkIcon />
                </ListItemIcon>
                <ListItemText primary="Zoom Link" secondary={cls?.zoomLink} />
              </ListItem> */}
              {/* Zoom link */}
            </List>
          </GridDiv>
          {company?.description && (
            <MultilineListItem>
              <ListItemIcon>
                <ContactSupportIcon />
              </ListItemIcon>
              <ListItemText
                primary="Description"
                secondary={capitalize(company?.description)}
              />
            </MultilineListItem>
          )}
          {/* Additional Details */}
        </Loading>
      </Wrapper>
      <Wrapper width="50%">
        <Center>
          <TitleWrapper>
            <H1 color={"#9e9e23"}>Jobs</H1>
          </TitleWrapper>
        </Center>
        <br />
        <Loading loading={loading} size={30}>
          <StyledUl>
            {company?.Jobs && (
              <li>
                <TableHeader repeatFormula="1fr 2.5fr 2.5fr 1fr">
                  <PersonIcon />
                  <StyledSpan weight="bold">Position</StyledSpan>
                  <StyledSpan weight="bold">Location</StyledSpan>
                  <StyledSpan weight="bold">Contact</StyledSpan>
                </TableHeader>
              </li>
            )}
            {company?.Jobs &&
              company?.Jobs!.map((job: Omit<IJob, "Company">) => (
                <li key={job.id}>
                  <StyledLink color="black" to={`/job/${job.id}`}>
                    <StyledDiv repeatFormula="1fr 2.5fr 2.5fr 1fr">
                      <PersonIcon />
                      <StyledSpan weight="bold">
                        {capitalize(job.position)}
                      </StyledSpan>
                      <StyledSpan>{capitalize(job.location)}</StyledSpan>
                      <StyledSpan>{capitalize(job.contact)}</StyledSpan>
                    </StyledDiv>
                  </StyledLink>
                </li>
              ))}
          </StyledUl>
          <br />
          <Center></Center>
        </Loading>
      </Wrapper>
    </>
  );
}

export default SingleCompany;
