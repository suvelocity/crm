import React from "react";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import EmailIcon from "@material-ui/icons/Email";
import { H1, Wrapper, TitleWrapper } from "../styles/styledComponents";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import DialpadIcon from "@material-ui/icons/Dialpad";
import SubjectIcon from "@material-ui/icons/Subject";
import ClassIcon from "@material-ui/icons/Class";

const mock = {
  _id: "fkjshfkjdfdgfddsfhsdf",
  email: "foshio@bar.com",
  firstName: "Fooshi",
  lastName: "Barli",
  phone: "1234567890",
  idNumber: "1234567890",
  description: "description",
  course: "362399837402",
};

function SingleStudent() {
  return (
    <Wrapper>
      <TitleWrapper>
        <H1>Student</H1>
      </TitleWrapper>
      <List>
        <ListItem>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText
            primary="Name"
            secondary={mock.firstName + " " + mock.lastName}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <EmailIcon />
          </ListItemIcon>
          <ListItemText primary="Email" secondary={mock.email} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <PhoneIcon />
          </ListItemIcon>
          <ListItemText primary="Phone Number" secondary={mock.phone} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <DialpadIcon />
          </ListItemIcon>
          <ListItemText primary="ID Number" secondary={mock.idNumber} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <SubjectIcon />
          </ListItemIcon>
          <ListItemText primary="Description" secondary={mock.description} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <ClassIcon />
          </ListItemIcon>
          <ListItemText primary="Course" secondary={mock.course} />
        </ListItem>
      </List>
      <Button variant="contained" color="primary" onClick={(e) => {}}>
        Apply for a job
      </Button>
    </Wrapper>
  );
}

export default SingleStudent;
