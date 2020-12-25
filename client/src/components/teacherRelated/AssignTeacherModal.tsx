import React, { useState, useEffect } from "react";
import network from "../../helpers/network";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { ITeacher, IClass } from "../../typescript/interfaces";
import {
  CircularProgress,
  ListItemText,
  ListItem,
  FormControlLabel,
  Checkbox,
  List,
  Typography,
  Modal,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import { Loading } from "react-loading-wrapper";
import { SingleListItem } from "../tableRelated";
import "react-loading-wrapper/dist/index.css";
import Swal from "sweetalert2";

function AssignTeacherModal({
  assignedClasses,
  teacher,
  getTeacher,
  handleClose
}: {
  assignedClasses: IClass[];
  teacher: ITeacher;
  getTeacher: () => void;
  handleClose: () => void;
}) {
  const classes = useStyles();
  const modalStyle = getModalStyle();
  const [open, setOpen] = useState(false);
  const [allClasses, setAllClasses] = useState<IClass[] | null>();
  const [classesTooAdd, setClassesTooAdd] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      (async () => {
        const { data }: { data: IClass[] } = await network.get(
          "/api/v1/class/all"
        );
        setAllClasses(
          data.filter(
            (c1: IClass) => !assignedClasses.some((c2:IClass) => c2.id === c1.id )
          )
        );
      })();
    } catch (error) {
      
      Swal.fire("Error Occurred", error.message, "error");
    }
  }, [assignedClasses]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (classesTooAdd.length > 0) {
      try {
        setLoading(true);
        await network.post(`/api/v1/teacher/addClassToTeacher`, {
          teacherWithClass: classesTooAdd.map(c => ({classId: `${c}`, teacherId: `${teacher.id}`}))
        });
        setTimeout(() =>{
          getTeacher();
          setLoading(false);
          handleClose();
        },1000)
      } catch (error) {
        Swal.fire("Error Occurred", error.message, "error");
      }
    } else {
      setOpen(false);
    }
  };

  const handleCheckBoxOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setClassesTooAdd((prev) => [...prev, e.target.value]);
    } else {
      setClassesTooAdd((prev) =>
        prev.filter((item) => item !== e.target.value)
      );
    }
  };
  let body = <CircularProgress />;
  if (allClasses) {
    body = (
      <div style={modalStyle} className={classes.paper}>
        <div className={classes.root}>
          <h1>Choose Classes To Assign to {teacher.firstName}</h1>
          {allClasses.length > 0 ? (
            <>
              {allClasses?.map((c: IClass) => (
                <Accordion key={c.id}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-label="Expand"
                    aria-controls="additional-actions2-content"
                    id="additional-actions2-header"
                  >
                    <FormControlLabel
                      aria-label="Acknowledge"
                      onClick={(event) => event.stopPropagation()}
                      onFocus={(event) => event.stopPropagation()}
                      control={
                        <Checkbox
                          id={`${c.id}`}
                          value={c.id}
                          onChange={handleCheckBoxOnChange}
                        />
                      }
                      label=""
                    />
                    <Typography className={classes.heading}>
                      {c.name} 
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      <SingleListItem
                        primary="startingDate"
                        secondary={c.startingDate}
                      />
                      <SingleListItem
                        primary="endingDate"
                        secondary={c.endingDate}
                      />
                      <ListItem>
                        <ListItemText
                          primary="Course"
                          secondary={c.course}
                        />
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
              <Button
                style={{ backgroundColor: "#e2e600", color: "white" }}
                className={classes.button}
                color="primary"
                onClick={handleSubmit}
                id="assign"
              >
                Assign
              </Button>
            </>
          ) : (
            <h2>No students available</h2>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Button
        id="assignTeacher"
        style={{ backgroundColor: "#e2e600", color: "white" }}
        variant="contained"
        onClick={handleOpen}
      >
        Assign a Class
      </Button>
      <Modal style={{ overflow: "scroll" }} open={open} onClose={() => setOpen(false)}>
        <Loading loading={loading}>{body}</Loading>
      </Modal>
    </>
  );
}

export default AssignTeacherModal;

function getModalStyle() {
  return {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
}

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
    button: {
      textAlign: "center",
      margin: 10,
    },
  })
);
