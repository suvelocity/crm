import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import taskImg from "../../../media/TaskManagementBlog.jpg";
import PublishIcon from "@material-ui/icons/Publish";
import LinkIcon from "@material-ui/icons/Link";
import network from "../../../helpers/network";
import Swal from "sweetalert2";
import styled from "styled-components";
import Submit from "../tasks/Submit";
import Modal from "@material-ui/core/Modal";
import { StyledAtavLink } from "../../../styles/styledComponents";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { Link } from "react-router-dom";
import AssignmentLateIcon from "@material-ui/icons/AssignmentLate";
import BlockIcon from "@material-ui/icons/Block";

const StyledCard = styled(Card)`
  /* background-color: ${({ theme }: { theme: any }) => theme.colors.card};
  color: ${({ theme }: { theme: any }) => theme.colors.font}; */
  display: flex;
  flex-direction: column;
`;

const StyledCardContent = styled(CardContent)`
  /* background-color: ${({ theme }: { theme: any }) => theme.colors.card};
  color: ${({ theme }: { theme: any }) => theme.colors.font}; */

  flex-grow: 1;
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 300,
      width: 300,
      marginRight: 15,
      color: `${({ theme }: { theme: any }) => theme.colors.font}`,
    },
    media: {
      height: 0,
      width: "100%",
      paddingTop: "56.25%", // 16:9
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(90deg)",
    },
    manual: {
      backgroundColor: "#76b622",
    },
    challengeMe: {
      backgroundColor: "#d66910",
    },
    fcc: {
      backgroundColor: "#0e2557",
    },
  })
);

export default function SingleLessonTask(props: any) {
  const { task } = props;
  const [expanded, setExpanded] = React.useState(false);
  // const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  // const [c] = React.useState(getModalStyle);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <StyledCard className={classes.root}>
      <CardHeader
        style={{ backgroundColor: "#f2f2f2" }}
        avatar={
          <Avatar
            aria-label='recipe'
            className={
              task.type === "fcc"
                ? classes.fcc
                : task.type === "challengeMe"
                ? classes.challengeMe
                : classes.manual
            }>
            {task.type === "fcc" ? (
              "fcc"
            ) : task.type === "challengeMe" ? (
              "C"
            ) : (
              <AssignmentLateIcon />
            )}
          </Avatar>
        }
        title={task.title}
        subheader={`deadline: ${task.endDate.substring(0, 10)}`} //todo make date red/yellow if close to deadline and fix to israeli time
      />
      <StyledCardContent>
        <Typography variant='body1' color='textPrimary' component='p'>
          {task.body}
          {task.status === "disabled" && (
            <h3 style={{ color: "red" }}>Disabled!, edit to activate</h3>
          )}
        </Typography>
      </StyledCardContent>
      <CardActions>
        {task.type === "manual" && (
          <Link to='/tasks'>
            <IconButton
              // onClick={handleOpen}
              aria-label='submit button'
              disabled={task.type !== "manual" ? true : false}>
              <ArrowForwardIcon />
            </IconButton>
          </Link>
        )}
        {task.externalLink && (
          <StyledAtavLink href={task.externalLink} target='_blank'>
            <IconButton aria-label='external link?'>
              <LinkIcon />
            </IconButton>
          </StyledAtavLink>
        )}
      </CardActions>
    </StyledCard>
  );
}
