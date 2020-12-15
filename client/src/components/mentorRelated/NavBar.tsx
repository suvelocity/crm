import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import GroupIcon from '@material-ui/icons/Group';
import StorageIcon from '@material-ui/icons/Storage';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { useHistory, useLocation } from "react-router-dom";
import {
  StyledLink,
} from "../../styles/styledComponents";
import LocationOnIcon from '@material-ui/icons/LocationOn';

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

export default function NavBar() {
  const classes = useStyles();
  const [value, setValue] = useState<string>("/mentor");
  const history = useHistory();

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
        history.push(newValue);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction value="/mentor" label="All Programs" icon={<StorageIcon />}/>
      <BottomNavigationAction value="/mentor/all" label="All Mentors" icon={<GroupIcon />}/>
      <BottomNavigationAction value="/mentor/new" label="New Program" icon={<AddCircleOutlineIcon />} />
      <BottomNavigationAction value="/mentor/add" label="Add mentor" icon={<AccountCircleIcon />} />
    </BottomNavigation>
  );
}