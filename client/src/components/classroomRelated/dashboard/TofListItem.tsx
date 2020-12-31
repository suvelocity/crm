import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FolderIcon from "@material-ui/icons/Folder";
import DeleteIcon from "@material-ui/icons/Delete";
import AssignmentLateIcon from "@material-ui/icons/AssignmentLate";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { Link } from "react-router-dom";
import LinkIcon from "@material-ui/icons/Link";
import { StyledAtavLink } from "../../../styles/styledComponents";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      maxWidth: 752,
    },
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      margin: theme.spacing(4, 0, 2),
    },
  })
);

export default function ListItemComponent({ task }: { task: any }) {
  const classes = useStyles();

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          <AssignmentLateIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={task.title}
        secondary={`deadline: ${task.endDate.substring(0, 10)}`}
      />
      <ListItemSecondaryAction>
        {task.type === "manual" && (
          <Link to='/tasks'>
            <IconButton
              edge='end'
              aria-label='submit button'
              disabled={task.type !== "manual" ? true : false}>
              <ArrowForwardIcon />
            </IconButton>
          </Link>
        )}
        {task.externalLink && (
          <StyledAtavLink href={task.externalLink} target='_blank'>
            <IconButton edge='end' aria-label='external link?'>
              <LinkIcon />
            </IconButton>
          </StyledAtavLink>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
}
