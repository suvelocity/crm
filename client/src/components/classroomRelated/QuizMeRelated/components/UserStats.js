import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Typography,
  Divider
} from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Header from "./Header";
const userId = 2;
const useStyles = makeStyles((theme) => ({
  stats: {
    backgroundColor: theme.palette.background.paper,
    maxWidth: 800,
    paddingTop: "0.25em",
    paddingBottom: "0.25em",
  },
  stat: {
    margin: "0.75em 0",
    fontSize: "1.25em",
    fontWeight: 600,
    padding: "1em",
    borderRadius: "3px",
  },
  greenBackground: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.main,
  },
  statTitle: {
    fontWeight: 500,
  },
  collapseListItem: {
    width: "40%",
    margin: '0 1em',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.main,
    fontWeight: 700,
  },
  divider: {
    backgroundColor: theme.palette.primary.main
  },
  button: {
    margin: "0 1em",
  },
}));

export default function UserStats() {
  const classes = useStyles();

  const [userSubmissions, setUserSubmissions] = useState();
  useEffect(() => {
    const fetchUserSubmissions = async () => {
      const userSubmissions = (await axios.get(`/users/${userId}/submissions`))
        .data;
      setUserSubmissions(userSubmissions);
    };
    fetchUserSubmissions();
  }, []);
  const [quizzesSubmittedIsOpen, setQuizzesSubmittedIsOpen] = useState(false);

  const numOfSubs = userSubmissions && userSubmissions.submissions.length;
  const highestRank = userSubmissions && userSubmissions.stats.highestRank;
  const averageRank =
    userSubmissions && Number(userSubmissions.stats.averageRank).toFixed(1);
  return userSubmissions ? (
    <>
      <Header text="Statistics" />
      <Container>
        <Container maxWidth={"md"} className={classes.stats}>
          <List>
            {/* quizzes submitted */}
            <div className={classes.greenBackground}>
              <ListItem
                className={classes.stat}
                button
                onClick={() =>
                  setQuizzesSubmittedIsOpen(!quizzesSubmittedIsOpen)
                }
              >
                <ListItemText primary={`Quizzes Submitted: ${numOfSubs}`} 
                              className={classes.statTitle} 
                              disableTypography
                />
                {quizzesSubmittedIsOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              {/* quizzes submitted list (Collapse) */}
              <Collapse
                className={classes.collapse}
                in={quizzesSubmittedIsOpen}
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {userSubmissions.submissions.map((userSub, index) => (
                    <List>
                      <ListItem className={classes.collapseListItem}>
                        <ListItemText primary={`Quiz Name: ${userSub.Quiz.name}`} disableTypography />
                      </ListItem>
                      <Divider className={classes.divider}/>
                      <ListItem className={classes.collapseListItem}>
                        <ListItemText primary={`Rank: ${userSub.rank}`} disableTypography />
                      </ListItem>
                    </List>
                  ))}
                </List>
              </Collapse>
            </div>

            <div className={classes.greenBackground}>
              <ListItem
                className={classes.stat}
              >
                <ListItemText className={classes.statTitle} disableTypography>
                  Highest Rank: {highestRank}
                </ListItemText>
              </ListItem>
            </div>

            <div className={classes.greenBackground}>
              <ListItem
                className={classes.stat}
                variant={"div"}
                component={"div"}
                className={classes.stat}
              >
                <ListItemText className={classes.statTitle} disableTypography>
                  Average Rank: {averageRank}
                </ListItemText>
              </ListItem>
            </div>
          </List>
        </Container>
      </Container>
    </>
  ) : null;
}
