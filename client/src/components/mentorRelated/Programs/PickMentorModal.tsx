import React, { useState, useMemo } from "react";
import {
  IMeeting,
  IMentor,
  IMentorProgramForms,
  IStudent,
} from "../../../typescript/interfaces";
import network from "../../../helpers/network";
import {
  H1,
  Wrapper,
  TitleWrapper,
  StyledLink,
  Center,
  StyledSpan,
  StyledUl,
  StyledDiv,
  TableHeader,
} from "../../../styles/styledComponents";
import "date-fns";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import EditIcon from "@material-ui/icons/Edit";
import { Button, Modal } from "@material-ui/core";
import { capitalize } from "../../../helpers/general";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    paper: {
      position: "absolute",
      width: "50%",
      maxWidth: 700,
      minWidth: 300,
      backgroundColor: theme.palette.background.paper,
      borderRadius: 7,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      outline: "none",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: "33.33%",
      flexShrink: 0,
      fontWeight: theme.typography.fontWeightBold,
      marginTop: 11,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
      marginTop: 11,
    },
    button: {
      textAlign: "center",
      margin: 10,
    },
    dateTimePicker: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  })
);

interface PickProps {
  getTableData: Function;
  getAvailableMentors: Function;
  availableMentors: IMentor[];
  row: any;
  id: number;
}

function PickMentorModal({
  getTableData,
  getAvailableMentors,
  availableMentors,
  row,
  id,
}: PickProps) {
  const [open, setOpen] = useState<boolean>(false);
  const classes = useStyles();
  const modalStyle = getModalStyle();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className={classes.root}>
        <Center>
          <H1 color={"#c47dfa"}>Pick Mentor</H1>
        </Center>

        <div style={{ overflow: "scroll", maxHeight: 600 }}>
          <StyledUl>
            {availableMentors.map((mentor) => (
              <li>
                <StyledDiv
                  repeatFormula="0.5fr 1fr 1fr 1fr 1fr "
                  onClick={async () => {
                    row.MentorStudents &&
                    row.MentorStudents[0] &&
                    row.MentorStudents[0].Mentor
                      ? await network.put(
                          `/api/v1/M/classes/${row.MentorStudents[0].id}`,
                          {
                            mentorProgramId: id,
                            mentorId: mentor.id,
                            studentId: row.id,
                          }
                        )
                      : await network.post("/api/v1/M/classes", {
                          mentorProgramId: id,
                          mentorId: mentor.id,
                          studentId: row.id,
                        });
                    getTableData();
                    getAvailableMentors();
                    handleClose()
                  }}
                >
                  <StyledSpan weight="bold">
                    {mentor?.MentorStudents!.length || 0}
                  </StyledSpan>
                  <StyledSpan weight="bold">
                    {capitalize(mentor.name)}
                  </StyledSpan>
                  <StyledSpan>{mentor.address}</StyledSpan>
                  <StyledSpan>{mentor.company}</StyledSpan>
                  <StyledSpan>{mentor.role}</StyledSpan>
                </StyledDiv>
              </li>
            ))}
          </StyledUl>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Button>
        <EditIcon onClick={handleOpen}>Send Initial Mails</EditIcon>
      </Button>
      <Modal open={open} onClose={handleClose}>
        {body}
      </Modal>
    </>
  );
}

export default PickMentorModal;

function getModalStyle() {
  return {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
}
