import React, { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import PeopleIcon from "@material-ui/icons/People";
import WorkIcon from "@material-ui/icons/Work";
import BusinessIcon from "@material-ui/icons/Business";
import styled from "styled-components";
import { StyledLink } from "../styles/styledComponents";
import { useHistory } from "react-router-dom";
import ClassIcon from "@material-ui/icons/Class";
import TimelineIcon from "@material-ui/icons/Timeline";
import network from "../helpers/network";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { getRefreshToken, AuthContext } from "../helpers";

function NavAppBar() {
  const [open, setOpen] = useState(false);
  const history = useHistory();
  //@ts-ignore
  const { setUser } = useContext(AuthContext);

  const signOut = async () => {
    await network.post("/api/v1/auth/signout", {
      refreshToken: getRefreshToken(),
    });
    setUser(null);
    history.push("/");
  };

  const handleDrawer = () => {
    setOpen(true);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            onClick={handleDrawer}
            color="inherit"
            edge="start"
            aria-label="menu"
          >
            <Menu />
          </IconButton>
          <StyledLink to="/student/all">
            <Typography variant="h4">CRM</Typography>
          </StyledLink>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <StyledDrawer>
          <StyledLink to="/student/all">
            <DrawerItem onClick={() => setOpen(false)}>
              Students
              <PeopleIcon style={{ position: "absolute", right: 10 }} />
            </DrawerItem>
          </StyledLink>
          <StyledLink to="/job/all">
            <DrawerItem onClick={() => setOpen(false)}>
              Jobs
              <WorkIcon style={{ position: "absolute", right: 10 }} />
            </DrawerItem>
          </StyledLink>
          <StyledLink to="/class/all">
            <DrawerItem onClick={() => setOpen(false)}>
              Classes
              <ClassIcon style={{ position: "absolute", right: 10 }} />
            </DrawerItem>
          </StyledLink>
          <StyledLink to="/company/all">
            <DrawerItem onClick={() => setOpen(false)}>
              Companies
              <BusinessIcon style={{ position: "absolute", right: 10 }} />
            </DrawerItem>
          </StyledLink>
          <StyledLink to="/process/all">
            <DrawerItem onClick={() => setOpen(false)}>
              Processes
              <TimelineIcon style={{ position: "absolute", right: 10 }} />
            </DrawerItem>
          </StyledLink>
          <DrawerItem onClick={signOut}>
            Sign Out
            <ExitToAppIcon style={{ position: "absolute", right: 10 }} />
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

export default NavAppBar;
