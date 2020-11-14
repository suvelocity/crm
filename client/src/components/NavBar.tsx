import React, { useState } from "react";
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
import styled from "styled-components";
import { StyledLink } from "../styles/styledComponents";

function NavAppBar() {
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
          <StyledLink to='/student/all'>
            <Typography variant='h4'>CRM</Typography>
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
          <StyledLink to='/student/all'>
            <DrawerItem onClick={() => setOpen(false)}>
              All students
              <PeopleIcon style={{ position: "absolute", right: 10 }} />
            </DrawerItem>
          </StyledLink>
          <StyledLink to='/job/all'>
            <DrawerItem onClick={() => setOpen(false)}>
              All Jobs
              <WorkIcon style={{ position: "absolute", right: 10 }} />
            </DrawerItem>
          </StyledLink>
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
