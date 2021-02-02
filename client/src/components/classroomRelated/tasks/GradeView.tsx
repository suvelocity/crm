import React, { useEffect, useState } from "react";
import { createStyles, makeStyles, Modal, Theme } from "@material-ui/core";
import { ITaskCriteria, ITaskLabel } from "../../../typescript/interfaces";
import { Grades } from "../../../typescript/interfaces";
import { network } from "../../../helpers";
import Swal from "sweetalert2";

//#region moved to server
// const calculateGrades = (grades: object, grades2: { grade: number } | null) => {
//   console.log("GRADES FUNCTION");
//   console.log(grades);
//   console.log(grades2);
//   console.log("*****************");
//   const avergaesOfGrades: any = {};
//   //if grades are not set yet
//   if (!grades) return "--";
//   if (Object.keys(grades).length === 0) return "--";

//   //@ts-ignore
//   if (grades?.belongsTo === "task") return grades.grade;

//   for (let gradeObj of Object.values(grades)) {
//     switch (gradeObj?.belongsTo) {
//       case "task":
//         return gradeObj.grade;
//       case "label":
//         avergaesOfGrades[gradeObj.belongsToId] =
//           // avergaesOfGrades[gradeObj.id]
//           // ? {score: avergaesOfGrades[gradeObj.is].score + gradeObj.grade, counter: avergaesOfGrades[gradeObj.is].counter++}
//           // :
//           { score: gradeObj.grade, count: 1 };
//         break;
//       case "criterion":
//         avergaesOfGrades[gradeObj.labelId] = avergaesOfGrades[gradeObj.labelId]
//           ? {
//               score: avergaesOfGrades[gradeObj.labelId].score + gradeObj.grade,
//               count: avergaesOfGrades[gradeObj.labelId].count + 1,
//             }
//           : { score: gradeObj.grade, count: 1 };
//         break;
//     }
//   }
//   console.log(grades);
//   console.log(avergaesOfGrades);
//   // console.log(avergaesOfGrades);
//   // console.log(Object.values(avergaesOfGrades));
//   // console.log(Object.keys(avergaesOfGrades));
//   // console.log(
//   //   Object.values(avergaesOfGrades).reduce(
//   //     (sum: number, current: any) => sum + current.score / current.count,
//   //     0
//   //   )
//   // );
//   return Math.floor(
//     Object.values(avergaesOfGrades).reduce(
//       (sum: number, current: any) => sum + current.score / current.count,
//       0
//     ) / Object.keys(avergaesOfGrades).length
//   );

//   // if (grades) {
//   //   if (grades2 === null) {
//   //     return "--";
//   //   }
//   //   if (grades2 !== null && grades2.hasOwnProperty("grade")) {
//   //     return grades2.grade;
//   //   }
//   //   for (let i = 0; i < grades.length; i++) {
//   //     const grade: Grades = grades[i];
//   //     let sum = 0;
//   //     let length = 0;
//   //     if (grade.Criteria.length === 0 && grade.Label == null) {
//   //       return "--";
//   //     }
//   //     for (let j = 0; j < grade.Criteria.length; j++) {
//   //       const val: Criteria = grade.Criteria[j];
//   //       if (val == null) {
//   //         return "--";
//   //       }
//   //       sum += val.grade;
//   //       length++;
//   //     }
//   //     if (grade.Label) {
//   //       sum += grade.Label.grade;
//   //       length++;
//   //     }
//   //     if (length !== 0) {
//   //       arrayOfAverageScores.push(Math.round(sum / length));
//   //     }
//   //   }
//   // }

//   // if (arrayOfAverageScores.length !== 0) {
//   //   console.log(arrayOfAverageScores);
//   //   let sum = 0;
//   //   arrayOfAverageScores.forEach((val: number) => (sum += val));
//   //   return Math.round(sum / arrayOfAverageScores.length);
//   // } else {
//   //   return "--";
//   // }
// };
//#endregion

export default function GradeButton({
  taskLabels,
  grades,
  key,
  taskId,
  studentId,
  overallGrade,
  taskOfStudentId,
}: {
  taskLabels: ITaskLabel[];
  grades: Grades[];
  key: string;
  taskId: number;
  studentId: number;
  overallGrade: number;
  taskOfStudentId: number;
}) {
  //#region moved to server
  // const makeGradesMap: (grades: Grades[]) => any = (grades: Grades[]) => {
  //   console.log(grades);
  //   return Array.isArray(grades)
  //     ? grades.reduce(
  //         (gradesMap: any, label: any, index: number) =>
  //           // label.Criteria[0]
  //           label.Label
  //             ? {
  //                 ...gradesMap,
  //                 [`label${label?.Label?.belongsToId}`]: label.Label,
  //               }
  //             : // label.Criteria.reduce(
  //               //     (sameGradesMap: any, criterion: any) =>
  //               //       criterion
  //               //         ? {
  //               //             ...sameGradesMap,
  //               //             [`criterion${criterion?.belongsToId}`]: {
  //               //               ...criterion,
  //               //               labelId: index,
  //               //             },
  //               //           }
  //               //         : gradesMap,
  //               //     gradesMap
  //               //   )
  //               label.Criteria.reduce(
  //                 (sameGradesMap: any, criterion: any) =>
  //                   criterion
  //                     ? {
  //                         ...sameGradesMap,
  //                         [`criterion${criterion?.belongsToId}`]: {
  //                           ...criterion,
  //                           labelId: index,
  //                         },
  //                       }
  //                     : sameGradesMap,
  //                 gradesMap
  //               ),
  //         // label.Label
  //         // ? {
  //         //     ...gradesMap,
  //         //     [`label${label?.Label?.belongsToId}`]: label.Label,
  //         //   }
  //         // : gradesMap,
  //         {}
  //       )
  //     : grades;
  // };
  //#endregion

  const [openGrades, setOpenGrades] = useState<boolean>(false);
  const [activeGrades, setActiveGrades] = useState<any>(grades);
  const [overallGradeState, setOverallGradeState] = useState<number>(
    overallGrade
  );
  const handleOpen: () => void = () => {
    setOpenGrades(true);
  };

  const handleClose: () => void = () => {
    setOpenGrades(false);
  };

  const updateOverallGrade: () => Promise<void> = async () => {
    try {
      const { data: newOverall } = await network.get(
        `/api/v1/grade/overall/${taskId}/${studentId}`
      );
      console.log(newOverall);
      setOverallGradeState(newOverall.grade);
    } catch (e) {
      console.log(e);
      Swal.fire(
        "Oh Shit",
        `Failed to update grade.
          Please try again in a moment`,
        "error"
      );
    }
  };

  useEffect(() => {
    updateOverallGrade();
  }, [activeGrades]);

  return (
    <>
      <span onClick={handleOpen}>{overallGradeState}</span>
      <GradeView
        open={openGrades}
        handleClose={handleClose}
        taskLabels={taskLabels}
        grades={activeGrades}
        setActiveGrades={setActiveGrades}
        key={key}
        taskId={taskId}
        studentId={studentId}
        taskOfStudentId={taskOfStudentId}
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
  taskOfStudentId,
}: {
  open: boolean;
  handleClose: () => void;
  taskLabels: ITaskLabel[];
  grades: Grades[]; //| Partial<ITaskLabel>;
  key: string;
  setActiveGrades: Function;
  taskId: number;
  studentId: number;
  taskOfStudentId: number;
}) {
  const classes = useStyles();

  const changeGrade: (
    grade: string,
    belongsTo: string,
    belongsToId: number,
    studentId: number,
    labelIndex: number
  ) => Promise<void> = async (
    grade: string,
    belongsTo: string,
    belongsToId: number,
    studentId: number,
    labelIndex: number
  ) => {
    try {
      //@ts-ignore
      if (isNaN(grade)) return;
      const { data } = await network.post("/api/v1/grade", {
        grade,
        belongsTo,
        belongsToId,
        studentId,
      });

      await network.patch(`/api/v1/task/check/${taskOfStudentId}`);

      setActiveGrades((prev: any) => {
        console.log(prev);
        const updated = {
          ...prev,
          [`${belongsTo}${belongsToId}`]: { ...data, labelId: labelIndex },
        };
        return updated;
      });
    } catch (e) {
      console.log(e);
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
                        defaultValue={
                          //@ts-ignore
                          grades[`criterion${criterion.id}`]?.grade
                        }
                        onBlur={(e) =>
                          changeGrade(
                            e.target.value,
                            "criterion",
                            criterion.id!,
                            studentId,
                            i
                          )
                        }
                      />
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
                  grades[`task${taskId}`]?.grade
                }
                onBlur={(e) =>
                  changeGrade(e.target.value, "task", taskId, studentId, 0)
                }
              />
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
