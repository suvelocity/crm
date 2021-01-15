import React, { useState } from "react";
import { createStyles, makeStyles, Modal, Theme } from "@material-ui/core";
import { ITaskCriteria, ITaskLabel } from "../../../typescript/interfaces";
import { Label } from "@material-ui/icons";

export default function GradeButton({
  taskLabels,
}: {
  taskLabels: ITaskLabel[];
}) {
  const [openGrades, setOpenGrades] = useState<boolean>(false);

  const handleOpen: () => void = () => {
    setOpenGrades(true);
  };
  const handleClose: () => void = () => {
    setOpenGrades(false);
  };

  return (
    <>
      <span onClick={handleOpen}>----</span>
      <GradeView
        open={openGrades}
        handleClose={handleClose}
        taskLabels={taskLabels}
      />
    </>
  );
}

function GradeView({
  open,
  handleClose,
  taskLabels,
}: {
  open: boolean;
  handleClose: () => void;
  taskLabels: ITaskLabel[];
}) {
  const classes = useStyles();
  console.log("******");
  console.log(taskLabels);
  return (
    <Modal open={open} onClose={handleClose}>
      <>
        {/* @ts-ignore */}
        <div className={classes.paper} style={modalStyle}>
          {taskLabels[0]
            ? taskLabels.map((label: ITaskLabel, i: number) => (
                <>
                  <h1>{label.Label?.name}</h1>
                  {label.Criteria[0] ? (
                    label.Criteria.map(
                      (criterion: ITaskCriteria, j: number) => (
                        <div key={`label${i}-crit${j}`}>
                          <span>{criterion.name}</span>
                          <input type="number" placeholder="Grade" />
                        </div>
                      )
                    )
                  ) : (
                    <input
                      key={`label${i}`}
                      type="number"
                      placeholder="Grade"
                    />
                  )}
                </>
              ))
            : "No Labels for this task. Make this text a simple input where i will be able to submit a grade"}
        </div>
      </>
    </Modal>
  );
}

const modalStyle = {
  top: `50%`,
  left: `50%`,
  transform: `translate(-${50}%, -${50}%)`,
  overflowY: "scroll",
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);
