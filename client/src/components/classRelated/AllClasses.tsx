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
import PersonIcon from "@material-ui/icons/Person";
import { IClass } from "../../typescript/interfaces";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import BusinessIcon from "@material-ui/icons/Business";
import DateRangeIcon from "@material-ui/icons/DateRange";
import SubjectIcon from "@material-ui/icons/Subject";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ClassIcon from "@material-ui/icons/Class";
import LinkIcon from "@material-ui/icons/Link";
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
      marginLeft: 15,
      marginTop: 3,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  })
);

function AllClasses() {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const styleClasses = useStyles();

  useEffect(() => {
    (async () => {
      const { data } = await network.get("/api/v1/class/all");
      setClasses(data);
      setLoading(false);
    })();
  }, []);

  return (
    <Wrapper width="80%">
      <Center>
        <TitleWrapper>
          <H1 color="#2c6e3c">All Classes</H1>
        </TitleWrapper>
        <br />
        <StyledLink to="/class/add">
          <Button
            variant="contained"
            style={{ backgroundColor: "#2c6e3c", color: "white" }}
          >
            Add Class
          </Button>
        </StyledLink>
      </Center>
      <br />
      <Loading loading={loading} size={30}>
        <StyledUl>
          {classes && (
            <li>
              <TableHeader>
                <ClassIcon />
                <StyledSpan weight="bold">name</StyledSpan>
                <StyledSpan weight="bold">course</StyledSpan>
                <StyledSpan weight="bold">cycle number</StyledSpan>
              </TableHeader>
            </li>
          )}
          {classes &&
            classes.map((cls) => (
              <li>
                <StyledLink
                  to={`/class/${cls.id}`}
                  textDecoration={"true"}
                  color="black"
                >
                  <StyledDiv>
                    <ClassIcon />
                    <StyledSpan weight="bold">{cls.name}</StyledSpan>
                    <StyledSpan>{cls.course}</StyledSpan>
                    <StyledSpan>{cls.cycleNumber}</StyledSpan>
                  </StyledDiv>
                </StyledLink>
              </li>
            ))}
        </StyledUl>
      </Loading>
    </Wrapper>
  );
}

export default AllClasses;

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
