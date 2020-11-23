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
    <Wrapper>
      <Center>
        <TitleWrapper>
          <H1>All Classes</H1>
        </TitleWrapper>
        <br />
        <StyledLink to="/class/add">
          <Button variant="contained" color="primary">
            Add Class
          </Button>
        </StyledLink>
      </Center>
      <br />
      <Loading loading={loading} size={30}>
        {classes &&
          classes.map((cls) => (
            <Accordion key={cls.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <ClassIcon />
                <Typography className={styleClasses.heading}>
                  <StyledLink
                    to={`/class/${cls.id}`}
                    textDecoration={"true"}
                    color="black"
                  >
                    {cls.name}
                  </StyledLink>
                </Typography>
                <Typography className={styleClasses.secondaryHeading}>
                  {cls.course}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <ClassIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Name"} secondary={cls.name} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <ClassIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Course"} secondary={cls.course} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarTodayIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Starting Date"}
                      secondary={cls.startingDate}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarTodayIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Ending Date"}
                      secondary={cls.endingDate}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <RotateLeftIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Cycle Number"}
                      secondary={cls?.cycleNumber}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LinkIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Zoom Link"}
                      secondary={cls.zoomLink}
                    />
                  </ListItem>
                  {cls.additionalDetails && (
                    <ListItem>
                      <ListItemIcon>
                        <SubjectIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={"Additional Details"}
                        secondary={cls.additionalDetails}
                      />
                    </ListItem>
                  )}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
      </Loading>
    </Wrapper>
  );
}

export default AllClasses;
