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

interface IStudent {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  idNumber: string;
  description: string;
  course: any; // Change This.
}
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
  const classes = useStyles();

  useEffect(() => {
    // (async () => {
    //   const { data } = await network.get("api/v1/students");
    //   setStudents(data);
    // })();
    const mockData: IStudent[] = [
      {
        _id: "fkjshfkjdsfhsdf",
        email: "foo@bar.com",
        firstName: "Foo",
        lastName: "Bar",
        phone: "1234567890",
        idNumber: "1234567890",
        description: "description",
        course: "362399837402",
      },
      {
        _id: "fkjshfkjdsfdsfdsfdshsdf",
        email: "foo0@bar.com",
        firstName: "Foa",
        lastName: "Baro",
        phone: "1234567890",
        idNumber: "1234567890",
        description: "description",
        course: "362399837402",
      },
      {
        _id: "fkjshfkdfgdfgfjdsfhsdf",
        email: "foo123@bar.com",
        firstName: "Fookoo",
        lastName: "Baron",
        phone: "1234567890",
        idNumber: "1234567890",
        description: "description",
        course: "362399837402",
      },
      {
        _id: "fkjshfkjdfdgfddsfhsdf",
        email: "foshio@bar.com",
        firstName: "Fooshi",
        lastName: "Barli",
        phone: "1234567890",
        idNumber: "1234567890",
        description: "description",
        course: "362399837402",
      },
    ];
    setStudents(mockData);
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
      {students &&
        students.map((student) => (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <PersonIcon />
              <StyledLink textDecoration color="black" to="/student/id">
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
                  <ListItemText primary={"Course"} secondary={student.course} />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
    </Wrapper>
  );
}

export default AllStudents;
