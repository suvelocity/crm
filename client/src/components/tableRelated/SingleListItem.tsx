import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";

interface Props {
  children?: React.ReactNode;
  primary: number | string | undefined | null;
  secondary: number | string | undefined | null;
}

export const SingleListItem = (props: Props) => (
  <ListItem>
    {props.children && <ListItemIcon>{props.children}</ListItemIcon>}
    <ListItemText primary={props.primary} secondary={props.secondary} />
  </ListItem>
);
