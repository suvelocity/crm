import React, { useState,useContext } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import SignOutButton from "./auth/SignOutButton";
import styled from "styled-components";
import { StyledLink } from "../styles/styledComponents";
import SchoolIcon from '@material-ui/icons/School';
import DashboardIcon from '@material-ui/icons/Dashboard';
import TodayIcon from '@material-ui/icons/Today';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import StreetviewIcon from '@material-ui/icons/Streetview';
import {AuthContext} from '../helpers'
import { IUser } from '../typescript/interfaces';
function ClassRoomNavBar() {
      //@ts-ignore
  const {user} = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const handleDrawer = () => {
    setOpen(true);
  };
  return (
    <div>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            onClick={handleDrawer}
            color='inherit'
            edge='start'
            aria-label='menu'
          >
            <Menu />
          </IconButton>
          <StyledLink to='/'>
            <Typography variant='h4'>Classroom</Typography>
          </StyledLink>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor='left'
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <StyledDrawer>
          <StyledLink to="/">
            <DrawerItem onClick={() => setOpen(false)}>
              Dashboard
              <DashboardIcon style={{ position: "absolute", right: 10 }} />
            </DrawerItem>
          </StyledLink>
          <StyledLink to="/lessons">
            <DrawerItem onClick={() => setOpen(false)}>
              Lessons
              <SchoolIcon style={{ position: "absolute", right: 10 }} />
            </DrawerItem>
          </StyledLink>
          <StyledLink to="/schedhule">
            <DrawerItem onClick={() => setOpen(false)}>
            Schedhule
              <TodayIcon style={{ position: "absolute", right: 10 }} />
            </DrawerItem>
          </StyledLink>
          <StyledLink to="/tasks">
            <DrawerItem onClick={() => setOpen(false)}>
            Tasks
              <AssignmentLateIcon style={{ position: "absolute", right: 10 }} />
            </DrawerItem>
          
      {(user.userType=='teacher')&&
          <StyledLink to="/teacher">
            <DrawerItem onClick={() => setOpen(false)}>
            Teacher
              <StreetviewIcon style={{ position: "absolute", right: 10 }} />
            </DrawerItem>
          </StyledLink>
      }
        </StyledLink>
          <DrawerItem onClick={() => setOpen(false)}>
          <SignOutButton style={{ position: "absolute", right: 10 }}/>
            </DrawerItem>
        </StyledDrawer>
      </Drawer>
    </div>
  );
}

const DrawerItem = styled.div`
  padding: 25px;
  color: white;
  width: 100%;
  height: 1.5em;
  transition: 100ms;

  &:hover {
    color: #3f51b5;
    background-color: white;
    cursor: pointer;
  }
`;

const StyledDrawer = styled.div`
  background-color: #3f51b5;
  height: 100%;
  width: 220px;
  overflow: hidden;
`;

export default ClassRoomNavBar;
