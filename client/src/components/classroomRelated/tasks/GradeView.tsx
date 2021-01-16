import React, { useState } from "react";
import { createStyles, makeStyles, Modal, Theme } from "@material-ui/core";
import {
  ITask,
  ITaskCriteria,
  ITaskLabel,
} from "../../../typescript/interfaces";
import { Label } from "@material-ui/icons";
import { network } from "../../../helpers";

export default function GradeButton({
  taskLabels,
  grades,
  key,
  taskId,
  studentId,
}: {
  taskLabels: ITaskLabel[];
  grades: Partial<ITask>;
  key: string;
  taskId: number;
  studentId: number;
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
        grades={grades}
        key={key}
        taskId={taskId}
        studentId={studentId}
      />
    </>
  );
}

function GradeView({
  open,
  handleClose,
  taskLabels,
  grades,
  key,
  taskId,
  studentId,
}: {
  open: boolean;
  handleClose: () => void;
  taskLabels: ITaskLabel[];
  grades: Partial<ITask>;
  key: string;
  taskId: number;
  studentId: number;
}) {
  const classes = useStyles();

  const changeGrade: (
    grade: string,
    belongsTo: string,
    belongsToId: number,
    studentId: number
  ) => Promise<void> = async (
    grade: string,
    belongsTo: string,
    belongsToId: number,
    studentId: number
  ) => {
    try {
      // console.log(grade, belongsTo, belongsToId, studentId);
      //@ts-ignore
      if (isNaN(grade)) return;
      await network.post("/api/v1/grade", {
        grade,
        belongsTo,
        belongsToId,
        studentId,
      });
      alert("success");
    } catch (e) {
      console.log(e);
      alert("Error");
    }
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <>
        {/* @ts-ignore */}
        <div className={classes.paper} style={modalStyle}>
          {taskLabels[0] ? (
            taskLabels.map((label: ITaskLabel, i: number) => (
              <>
                <h1>{label.Label?.name}</h1>
                {label.Criteria[0] ? (
                  label.Criteria.map((criterion: ITaskCriteria, j: number) => (
                    <div key={`${key}-label${i}-crit${j}-container`}>
                      <span key={`${key}-label${i}-crit${j}-name`}>
                        {criterion.name}
                      </span>
                      <input
                        key={`input-${key}-label${i}-crit${j}`}
                        type="number"
                        placeholder="Grade"
                        onBlur={(e) =>
                          changeGrade(
                            e.target.value,
                            "criterion",
                            criterion.id!,
                            studentId
                          )
                        }
                      />
                      <span key={`grade-${key}-label${i}-crit${j}`}>
                        {grades?.TaskLabels![i]?.Criteria![j].Grades![0]?.grade
                          ? grades?.TaskLabels![i]?.Criteria![j].Grades![0]
                              ?.grade
                          : "--"}
                      </span>
                      {/* <button
                        key={`button-${key}-label${i}-crit${j}`}
                        onClick={() =>
                          changeGrade(95, "criterion", criterion.id!, studentId)
                        }
                      >
                        Update
                      </button> */}
                    </div>
                  ))
                ) : (
                  <>
                    <input
                      key={`input-${key}-label${i}`}
                      type="number"
                      placeholder="Grade"
                      onBlur={(e) =>
                        changeGrade(
                          e.target.value,
                          "label",
                          label.id!,
                          studentId
                        )
                      }
                    />
                    <span key={`grade-${key}-label${i}`}>
                      {grades?.TaskLabels![i]?.Label!.Grades![0]?.grade
                        ? grades?.TaskLabels![i]?.Label!.Grades![0]?.grade
                        : "--"}
                    </span>
                    {/* <button
                      key={`button-${key}-label${i}`}
                      onClick={() =>
                        changeGrade(80, "label", label.id!, studentId)
                      }
                    >
                      Update
                    </button> */}
                  </>
                )}
              </>
            ))
          ) : (
            <>
              <input
                key={`input-${key}`}
                type="number"
                placeholder="Grade"
                onBlur={(e) =>
                  changeGrade(e.target.value, "task", taskId, studentId)
                }
              />
              <span key={`grade-${key}`}>
                {grades.Grades![0]?.grade ? grades.Grades![0]?.grade : "--"}
              </span>
              {/* <button
                key={`button-${key}`}
                onClick={() => changeGrade(100, "task", taskId, studentId)}
              >
                Update
              </button> */}
            </>
          )}
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
