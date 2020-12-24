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
import { Center, StyledAtavLink } from "../../../styles/styledComponents";

const StyledCard = styled(Card)`
  /* background-color: ${({ theme }: { theme: any }) => theme.colors.card};
  color: ${({ theme }: { theme: any }) => theme.colors.font}; */
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 300,
      width: 300,
      marginRight: 15,
      // backgroundColor: "#f2f2f2",
      // backgroundColor:"black",
      color: `${({ theme }: { theme: any }) => theme.colors.font}`,
      // backgroundColor: `${({ theme }: { theme: any }) =>
      //   theme.colors.background}`,
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
      backgroundColor: "#c0b62e",
    },
    challengeMe: {
      backgroundColor: "#d66910",
    },
    fcc: {
      backgroundColor: "#0e2557",
    },
  })
);

export default function SingleTask(props: any) {
  const { task, handleOpen, handleClose } = props;
  const [expanded, setExpanded] = React.useState(false);
  const classes = useStyles();

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
            {task.type === "fcc"
              ? "fcc"
              : task.type === "challengeMe"
              ? "C"
              : "!"}
          </Avatar>
        }
        title={task.title}
        subheader={`deadline :${task.endDate.substring(0, 10)}`} //todo make date red/yellow if close to deadline and fix to israeli time
      />
      {/* <CardMedia
        className={classes.media}
        image={taskImg}
        title='get to work!'
      /> */}
      <CardContent>
        <Typography variant='body2' color='textSecondary' component='p'>
          {task.body}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label='submit button'
          disabled={task.type !== "manual" ? true : false}>
          <PublishIcon />
        </IconButton>
        <StyledAtavLink href={task.externalLink} target='_blank'>
          <IconButton
            aria-label='external link?'
            disabled={task.externalLink ? false : true}>
            <LinkIcon />
          </IconButton>
        </StyledAtavLink>
      </CardActions>
    </StyledCard>
  );
}
