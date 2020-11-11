import React, { useState, useEffect } from "react";
import network from "../helpers/network";
import {
  H1,
  Wrapper,
  TitleWrapper,
  StyledLink,
} from "../styles/styledComponents";
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
import { IStudent } from "../typescript/interfaces";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightBold,
      marginLeft: 10,
      marginTop: 3,
    },
  })
);

function AllStudents() {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const classes = useStyles();

  useEffect(() => {
    (async () => {
      const { data } = await network.get("/api/v1/student/all");
      setStudents(data);
      setLoading(false);
    })();
  }, []);

  return (
    <Wrapper>
      <TitleWrapper>
        <H1>All Students</H1>
      </TitleWrapper>
      <br />
      <StyledLink to="/student/add">
        <Button variant="contained" color="primary">
          Add Student
        </Button>
      </StyledLink>
      <br />
      <br />
      <Loading loading={loading} size={30}>
        {students &&
          students.map((student) => (
            <Accordion key={student.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <PersonIcon />
                <StyledLink
                  textDecoration
                  color="black"
                  to={`/student/${student.id}`}
                >
                  <Typography className={classes.heading}>
                    {student.firstName} {student.lastName}
                  </Typography>
                </StyledLink>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary={"Name"}
                      secondary={student.firstName + " " + student.lastName}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={"Email"} secondary={student.email} />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={"Phone Number"}
                      secondary={student.phone}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={"ID Number"}
                      secondary={student.idNumber}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={"Description"}
                      secondary={student.description}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={"Class"} secondary={student.class} />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={"Address"}
                      secondary={student.address}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={"Age"} secondary={student.age} />
                  </ListItem>
                  {student.jobs.map((job: any, index: number) => (
                    <ListItem>
                      <ListItemText
                        primary={`Job ${index + 1}`}
                        secondary={job.position}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
      </Loading>
    </Wrapper>
  );
}

export default AllStudents;
