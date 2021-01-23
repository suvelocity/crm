import React, { useState } from "react";
import { createStyles, makeStyles, Modal, Theme } from "@material-ui/core";
import {
  Criteria,
  IGrade,
  ITask,
  ITaskCriteria,
  ITaskLabel,
} from "../../../typescript/interfaces";
import { Grades } from "../../../typescript/interfaces";
import { Grade, Label } from "@material-ui/icons";
import { network } from "../../../helpers";
import { flatten } from "lodash";

const calculateGrades = (grades: object, grades2: { grade: number } | null) => {
  console.log("GRADES FUNCTION");
  console.log(grades);
  console.log(grades2);
  console.log("*****************");
  const avergaesOfGrades: any = {};

  if (Object.keys(grades).length === 0) return "--";

  //@ts-ignore
  if (grades?.belongsTo === "task") return grades.grade;

  for (let gradeObj of Object.values(grades)) {
    switch (gradeObj?.belongsTo) {
      case "task":
        return gradeObj.grade;
      case "label":
        avergaesOfGrades[gradeObj.belongsToId] =
          // avergaesOfGrades[gradeObj.id]
          // ? {score: avergaesOfGrades[gradeObj.is].score + gradeObj.grade, counter: avergaesOfGrades[gradeObj.is].counter++}
          // :
          { score: gradeObj.grade, count: 1 };
        break;
      case "criterion":
        avergaesOfGrades[gradeObj.labelId] = avergaesOfGrades[gradeObj.labelId]
          ? {
              score: avergaesOfGrades[gradeObj.labelId].score + gradeObj.grade,
              count: avergaesOfGrades[gradeObj.labelId].count + 1,
            }
          : { score: gradeObj.grade, count: 1 };
        break;
    }
  }

  console.log(avergaesOfGrades);
  console.log(Object.values(avergaesOfGrades));
  console.log(Object.keys(avergaesOfGrades));
  console.log(
    Object.values(avergaesOfGrades).reduce(
      (sum: number, current: any) => sum + current.score / current.count,
      0
    )
  );
  return (
    Object.values(avergaesOfGrades).reduce(
      (sum: number, current: any) => sum + current.score / current.count,
      0
    ) / Object.keys(avergaesOfGrades).length
  );

  // if (grades) {
  //   if (grades2 === null) {
  //     return "--";
  //   }
  //   if (grades2 !== null && grades2.hasOwnProperty("grade")) {
  //     return grades2.grade;
  //   }
  //   for (let i = 0; i < grades.length; i++) {
  //     const grade: Grades = grades[i];
  //     let sum = 0;
  //     let length = 0;
  //     if (grade.Criteria.length === 0 && grade.Label == null) {
  //       return "--";
  //     }
  //     for (let j = 0; j < grade.Criteria.length; j++) {
  //       const val: Criteria = grade.Criteria[j];
  //       if (val == null) {
  //         return "--";
  //       }
  //       sum += val.grade;
  //       length++;
  //     }
  //     if (grade.Label) {
  //       sum += grade.Label.grade;
  //       length++;
  //     }
  //     if (length !== 0) {
  //       arrayOfAverageScores.push(Math.round(sum / length));
  //     }
  //   }
  // }

  // if (arrayOfAverageScores.length !== 0) {
  //   console.log(arrayOfAverageScores);
  //   let sum = 0;
  //   arrayOfAverageScores.forEach((val: number) => (sum += val));
  //   return Math.round(sum / arrayOfAverageScores.length);
  // } else {
  //   return "--";
  // }
};

export default function GradeButton({
  taskLabels,
  grades,
  key,
  taskId,
  studentId,
}: {
  taskLabels: ITaskLabel[];
  grades: Grades[];
  key: string;
  taskId: number;
  studentId: number;
}) {
  const makeGradesMap: (grades: Grades[]) => any = (grades: Grades[]) => {
    return Array.isArray(grades)
      ? grades.reduce(
          (gradesMap: any, label: any, index: number) =>
            // label.Criteria[0]
            label.Label
              ? {
                  ...gradesMap,
                  [`label${label?.Label?.belongsToId}`]: label.Label,
                }
              : // label.Criteria.reduce(
                //     (sameGradesMap: any, criterion: any) =>
                //       criterion
                //         ? {
                //             ...sameGradesMap,
                //             [`criterion${criterion?.belongsToId}`]: {
                //               ...criterion,
                //               labelId: index,
                //             },
                //           }
                //         : gradesMap,
                //     gradesMap
                //   )
                label.Criteria.reduce(
                  (sameGradesMap: any, criterion: any) =>
                    criterion
                      ? {
                          ...sameGradesMap,
                          [`criterion${criterion?.belongsToId}`]: {
                            ...criterion,
                            labelId: index,
                          },
                        }
                      : sameGradesMap,
                  gradesMap
                ),
          // label.Label
          // ? {
          //     ...gradesMap,
          //     [`label${label?.Label?.belongsToId}`]: label.Label,
          //   }
          // : gradesMap,
          {}
        )
      : grades;
  };

  console.log(grades);
  console.log(makeGradesMap(grades));
  const [openGrades, setOpenGrades] = useState<boolean>(false);
  const [activeGrades, setActiveGrades] = useState<any>(makeGradesMap(grades));
  const handleOpen: () => void = () => {
    setOpenGrades(true);
  };
  const handleClose: () => void = () => {
    setOpenGrades(false);
  };
  //@ts-ignore
  const calculatedScore = calculateGrades(activeGrades, activeGrades);

  return (
    <>
      <span onClick={handleOpen}>{calculatedScore}</span>
      <GradeView
        open={openGrades}
        handleClose={handleClose}
        taskLabels={taskLabels}
        grades={activeGrades}
        setActiveGrades={setActiveGrades}
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
  setActiveGrades,
  key,
  taskId,
  studentId,
}: {
  open: boolean;
  handleClose: () => void;
  taskLabels: ITaskLabel[];
  grades: Grades[]; //| Partial<ITaskLabel>;
  key: string;
  setActiveGrades: Function;
  taskId: number;
  studentId: number;
}) {
  const classes = useStyles();

  const changeGrade: (
    grade: string,
    belongsTo: string,
    belongsToId: number,
    studentId: number,
    i: number,
    j?: number
  ) => Promise<void> = async (
    grade: string,
    belongsTo: string,
    belongsToId: number,
    studentId: number,
    i: number,
    j?: number
  ) => {
    try {
      console.log(grade, belongsTo, belongsToId, studentId);
      //@ts-ignore
      if (isNaN(grade)) return;
      const { data } = await network.post("/api/v1/grade", {
        grade,
        belongsTo,
        belongsToId,
        studentId,
      });
      console.log(grades);
      console.log(i, j);
      setActiveGrades((prev: any) => ({
        ...prev,
        [`${belongsTo}${belongsToId}`]: data,
      }));
      // if (grades.hasOwnProperty("grade") || grades === null) {
      //   return setActiveGrades({ grade: Number(grade) });
      // }
      // const newGrades = grades.slice();
      // if (typeof i === "number" && typeof j === "number") {
      //   newGrades[i].Criteria[j] = { grade: Number(grade) };
      // } else if (typeof i === "number") {
      //   newGrades[i].Label = { grade: Number(grade) };
      // }
      setActiveGrades(grades);
    } catch (e) {
      console.log(e);
    }
  };

  // console.log("##########");
  // console.log(taskLabels);
  // console.log(grades);
  // console.log("##########");

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
                        //@ts-ignore
                        defaultValue={
                          //@ts-ignore
                          grades[`criterion${criterion.id}`]?.grade
                          // ? //@ts-ignore
                          //   grades[i].Criteria[j]
                          //   ? //@ts-ignore
                          //     grades[i].Criteria[j].grade
                          //   : false
                          // : "--"
                        }
                        onBlur={(e) =>
                          changeGrade(
                            e.target.value,
                            "criterion",
                            criterion.id!,
                            studentId,
                            i,
                            j
                          )
                        }
                      />
                      {/* <span key={`grade-${key}-label${i}-crit${j}`}>
                        {grades?.TaskLabels![i]?.Criteria![j].Grades![0]?.grade
                          ? grades?.TaskLabels![i]?.Criteria![j].Grades![0]
                              ?.grade
                          : "--"}
                      </span> */}
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
                      defaultValue={
                        //@ts-ignore
                        // grades[i] ? grades[i]?.Label?.grade : "--"
                        grades[`label${label.id}`]?.grade
                      }
                      onBlur={(e) =>
                        changeGrade(
                          e.target.value,
                          "label",
                          label.id!,
                          studentId,
                          i
                        )
                      }
                    />
                    {/* <span key={`grade-${key}-label${i}`}>
                      {grades?.TaskLabels![i]?.Label!.Grades![0]?.grade
                        ? grades?.TaskLabels![i]?.Label!.Grades![0]?.grade
                        : "--"}
                    </span> */}
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
                placeholder="Grade..."
                defaultValue={
                  //@ts-ignore
                  grades?.grade
                }
                onBlur={(e) =>
                  changeGrade(e.target.value, "task", taskId, studentId, 0)
                }
              />
              <span key={`grade-${key}`}>
                {
                  //@ts-ignore
                  grades?.grade ? grades?.grade : "--"
                }
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
