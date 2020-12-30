import React, { useState, useContext, useCallback, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  MenuItem,
  Badge,
  Menu as MainMenu,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import {
  Menu,
  FiberNew,
  NotificationsActive,
  Notifications,
} from "@material-ui/icons";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SignOutButton from "./auth/SignOutButton";
import styled from "styled-components";
import { StyledLink } from "../styles/styledComponents";
import SchoolIcon from "@material-ui/icons/School";
import DashboardIcon from "@material-ui/icons/Dashboard";
import TodayIcon from "@material-ui/icons/Today";
import QuizIcon from "@material-ui/icons/ListAlt";
import AssignmentLateIcon from "@material-ui/icons/AssignmentLate";
import StreetviewIcon from "@material-ui/icons/Streetview";
import { AuthContext } from "../helpers";
import { ThemeContext } from "../helpers";
import network from "../helpers/network";
import { IStudent } from "../typescript/interfaces";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
//@ts-ignore
import DarkModeToggle from "react-dark-mode-toggle";
import "./classroomNavBar.css";

function ClassRoomNavBar() {
  const [open, setOpen] = useState(false);
  const [mentorProgram, setMentorProgram] = useState<IStudent>();

  const handleDrawer = () => {
    setOpen(true);
  };
  //@ts-ignore
  const { user } = useContext(AuthContext);
  console.log(user)
  //@ts-ignore
  const { currentTheme, setCurrentTheme } = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

   
  const getMentors = useCallback(async () => {
    try {
      if (user.userType === "student") {
        const { data }: { data: IStudent } = await network.get(
          `/api/V1/M/student/${user.id}`
      );
      setMentorProgram(data);
    } } catch (err) {
      alert(err.message);
    }
  }, [user]);

  useEffect(() => {
    getMentors();
  }, []);

  const handleChangeTheme = () => {
    const isDark = currentTheme === "dark";
    if (isDark) {
      setCurrentTheme("light");
      localStorage.setItem("theme", "light");
    } else {
      setCurrentTheme("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <div>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            onClick={handleDrawer}
            color='inherit'
            edge='start'
            aria-label='menu'>
            <Menu />
          </IconButton>
          <Typography
            variant='h4'
            style={{
              marginRight: 15,
              marginTop: "auto",
              marginBottom: "auto",
            }}>
            Classroom
          </Typography>
          {/* <DarkModeToggle
            onChange={handleChangeTheme}
            checked={currentTheme === "dark"}
            size={50}
          /> */}
          <Typography
            variant='h6'
            style={{
              display: "flex",
              position: "absolute",
              right: 10,
              marginRight: 10,
            }}>
            {/* <>
              <IconButton
                onClick={handleClick}
                color='inherit'
                style={{ color: "red", marginRight: 10 }}>
                <Badge color='secondary' badgeContent={10}>
                  <Notifications style={{ marginRight: 10, color: "white" }} />
                </Badge>
              </IconButton>
            </> */}
            {user.userType === "teacher" ? (
              <SchoolIcon
                style={{
                  marginRight: 10,
                  marginTop: "auto",
                  marginBottom: "auto",
                }}
              />
            ) : (
              <AccountCircleIcon
                style={{
                  marginRight: 10,
                  marginTop: "auto",
                  marginBottom: "auto",
                }}
              />
            )}
            {user.firstName + " " + user.lastName}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor='left'
        open={open}
        onClose={() => {
          setOpen(false);
        }}>
        <StyledDrawer>
          <StyledLink to='/'>
            <DrawerItem onClick={() => setOpen(false)}>
              Dashboard
              <DashboardIcon style={{ position: "absolute", right: 10 }} />
            </DrawerItem>
          </StyledLink>
          <StyledLink to='/lessons'>
            <DrawerItem onClick={() => setOpen(false)}>
              Lessons
              <ImportContactsIcon style={{ position: "absolute", right: 10 }} />
            </DrawerItem>

            <StyledLink to='/tasks'>
              <DrawerItem onClick={() => setOpen(false)}>
                Tasks
                <AssignmentLateIcon
                  style={{ position: "absolute", right: 10 }}
                />
              </DrawerItem>
            </StyledLink>
          </StyledLink>
          <StyledLink to='/quizme'>
            <DrawerItem onClick={() => setOpen(false)}>
              QuizMe
              <QuizIcon style={{ position: "absolute", right: 10 }} />
            </DrawerItem>
          </StyledLink>

          {mentorProgram && mentorProgram.MentorStudents![0] && (
            <StyledLink to={`/mentor/${mentorProgram.MentorStudents![0].id}`}>
              <DrawerItem onClick={() => setOpen(false)}>
                mentors
                <StreetviewIcon style={{ position: "absolute", right: 10 }} />
              </DrawerItem>
            </StyledLink>
          )}
          <DrawerItem style={{ position: "fixed", bottom: 0, width: "170px" }}>
            <SignOutButton style={{ position: "absolute", right: 10 }} />
          </DrawerItem>
        </StyledDrawer>
      </Drawer>
    </div>
  );
}

export default ClassRoomNavBar;

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  //@ts-ignore
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "right",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const OneNotification = styled.div`
  width: 310px;
  height: 50px;
  display: flex;
  align-items: center;
`;

const DrawerItem = styled.div`
  padding: 25px;
  color: white;
  width: 100%;
  height: 1.5em;
  transition: 100ms;

  &:hover {
    color: #b33357;
    background-color: white;
    cursor: pointer;
  }
`;

const StyledDrawer = styled.div`
  background-color: ${({ theme }: { theme: any }) => theme.colors.sideBar};
  /* background-color: #3f51b5; */
  /* background-image:url('../media/scaleup.jpeg'); */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  width: 220px;
  overflow: hidden;
  /* display:flex;
  flex-direction:column; */
`;

const StyledAppBar = styled(AppBar)`
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.sidebar}; //TODO change
  width: 100%;
`;
