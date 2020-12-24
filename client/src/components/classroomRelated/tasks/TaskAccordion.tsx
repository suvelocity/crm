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
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import styled from "styled-components";
import { Center, StyledAtavLink } from "../../../styles/styledComponents";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 500,
      width: 500,
    },
    media: {
      height: 0,
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
    avatar: {
      backgroundColor: red[500],
    },
  })
);

export default function SingleTask(props: any) {
  const { task, handleOpen, handleClose } = props;
  const [expanded, setExpanded] = React.useState(false);
  const classes = useStyles();
  console.log(task);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    // <Card className={classes.root}>
    //   <CardHeader
    //     avatar={
    //       <Avatar aria-label='recipe' className={classes.avatar}>
    //         !
    //       </Avatar>
    //     }
    //     // action={
    //     //   <IconButton aria-label='settings'>
    //     //     <MoreVertIcon />
    //     //   </IconButton>
    //     // }
    //     title={`${task.Task.title} - ${task.Task.type}`}
    //     subheader={`deadline :${task.Task.endDate.substring(0, 10)}`} //todo make date red/yellow if close to deadline and fix to israeli time
    //   />
    //   <CardMedia
    //     className={classes.media}
    //     image={taskImg}
    //     title='get to work!'
    //   />
    //   <CardContent>
    //     <Typography variant='body2' color='textSecondary' component='p'>
    //       {task.Task.body}
    //     </Typography>
    //   </CardContent>
    //   <CardActions disableSpacing>
    //     <IconButton
    //       aria-label='submit button'
    //       onClick={() => {
    //         handleOpen(task.id);
    //       }}
    //       disabled={task.Task.type !== "manual" ? true : false}>
    //       <PublishIcon />
    //     </IconButton>
    //     <IconButton
    //       aria-label='external link?'
    //       disabled={task.Task.externalLink ? true : false}>
    //       <LinkIcon />
    //     </IconButton>
    //     {/* <IconButton
    //       className={clsx(classes.expand, {
    //         [classes.expandOpen]: expanded,
    //       })}
    //       onClick={handleExpandClick}
    //       aria-expanded={expanded}
    //       aria-label='show more'>
    //       <ExpandMoreIcon />
    //     </IconButton> */}
    //   </CardActions>
    // </Card>
    <TaskAccordrionContainer>
      <StyledAccordion>
        <StyledSummery
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'>
          {task.Task.title + " - " + task.Task.type}
        </StyledSummery>
        <hr style={{ width: "95%", opacity: "50%" }} />
        <StyledDetails>{task.Task.body}</StyledDetails>
        <StyledDetails>
          <IconButton
            aria-label='submit button'
            onClick={() => {
              handleOpen(task.id);
            }}
            disabled={task.Task.type !== "manual" ? true : false}>
            <PublishIcon />
          </IconButton>
          <StyledAtavLink href={task.Task.externalLink} target='_blank'>
            <IconButton
              aria-label='external link?'
              disabled={task.Task.externalLink ? false : true}>
              <LinkIcon />
            </IconButton>
          </StyledAtavLink>
        </StyledDetails>
        {/* <StyledDetails></StyledDetails> */}
      </StyledAccordion>
    </TaskAccordrionContainer>
  );
}
const TaskAccordrionContainer = styled.div`
  color: ${({ theme }: { theme: any }) => theme.colors.font};
  overflow: hidden;
  margin-bottom: 15px;
  width: 70%;
  margin-left: auto;
  margin-right: auto;
  padding: 0px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
`;

const StyledAccordion = styled(Accordion)`
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.accordion}; //TODO change
  width: 100%;
`;
const StyledSummery = styled(AccordionSummary)`
  color: ${({ theme }: { theme: any }) => theme.colors.font}; //TODO change
  font-weight: bold;
  font-size: 20px;
`;

const StyledDetails = styled(AccordionDetails)`
  color: ${({ theme }: { theme: any }) => theme.colors.font}; //TODO change
`;
