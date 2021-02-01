import { Router, Request, Response } from "express";
const router = Router();
//@ts-ignore
import { Class, Task, TaskofStudent } from "../../models";
//@ts-ignore
import { Student, Lesson, Event, TeacherofClass } from "../../models";
//@ts-ignore
import { TaskLabel, Criterion, Grade, Label } from "../../models";
import {
  IClass,
  ICriterion,
  IGrade,
  ITask,
  ITaskFilter,
  ITaskLabel,
  ITaskofStudent,
} from "../../types";
import { taskSchema, taskSchemaToPut } from "../../validations";
import {
  calculateGrade,
  getGradesOfTaskForStudent,
  makeGradesMap,
  parseFilters,
} from "../../helper";
import challenges from "./challenges";
import sequelize from "sequelize";
import { validateTeacher } from "../../middlewares";
import { flatten } from "lodash";

const createTask = async (req: Request, res: Response) => {
  const {
    lessonId,
    externalId,
    externalLink,
    createdBy,
    endDate,
    type,
    status,
    title,
    body,
    labels,
  } = req.body;
  const { error } = taskSchema.validate({
    lessonId,
    externalId,
    externalLink,
    createdBy,
    endDate,
    type,
    status,
    title,
    body,
    labels,
  });
  if (error) return res.status(400).json({ error: error.message });
  try {
    const task: ITask = await Task.create({
      lessonId,
      externalId,
      externalLink,
      createdBy,
      endDate,
      type,
      status,
      title,
      body,
    });

    await createTaskLabels(labels, task.id!);
    return task;
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Malformed Data" });
  }
};

const createTaskLabels: (
  labels: ITaskLabel[],
  taskId: number
) => Promise<void> | Error = async (labels: ITaskLabel[], taskId: number) => {
  // console.log("******************LABELS***************");
  // console.log(labels);
  // console.log("*****************************************");

  if (!Array.isArray(labels))
    throw new Error(`Expected an array but got ${typeof labels} instead`);

  try {
    const newTaskLabels: ITaskLabel[] = await TaskLabel.bulkCreate(
      labels.map((label: ITaskLabel) => {
        label.taskId = taskId;
        return label;
      })
    );

    await Promise.all(
      newTaskLabels.map((taskLabel: any, i: number) => {
        const parsed: ITaskLabel = taskLabel.toJSON();
        // console.log(parsed);
        return createCriteria(labels[i].Criteria, parsed.taskId, parsed.id!);
      })
    );
    // return newTaskLabels;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
};

const createCriteria: (
  criteria: ICriterion[],
  taskId: number,
  labelId: number
) => Promise<void> = async (
  criteria: ICriterion[],
  taskId: number,
  labelId: number
) => {
  // console.log("******************CRITERIA***************");
  // console.log(criteria);
  // console.log("*****************************************");

  if (!Array.isArray(criteria))
    return Promise.reject(
      `Expected an array but got ${typeof criteria} instead`
    );

  return Criterion.bulkCreate(
    criteria.map((criterion: ICriterion) => {
      criterion.taskId = taskId;
      criterion.labelId = labelId;
      return criterion;
    })
  );
};

// get task details: student list + grades
const getTaskDetails: (taskId: number) => Promise<any[]> = async (
  taskId: number
) => {
  const taskLabels: ITaskLabel[] = (
    await Task.findAll({
      where: { id: taskId },
      include: [
        {
          model: TaskLabel,
          include: [{ model: Criterion }, { model: Label }],
        },
      ],
    })
  )[0].toJSON().TaskLabels;

  const details: any[] = await Promise.all(
    (
      await TaskofStudent.findAll({
        where: { task_id: taskId },
        attributes: ["id", "studentId", "status", "submitLink", "updatedAt"],
        include: [
          {
            model: Student,
            attributes: ["firstName", "lastName"],
            include: [
              {
                model: Class,
                attributes: ["id", "name", "endingDate"],
              },
            ],
          },
        ],
      })
    ).map(async (taskOfStudent: any) => {
      //TODO solve this typescript way
      taskOfStudent = taskOfStudent.toJSON();
      const grades = await getGradesOfTaskForStudent(
        taskOfStudent.studentId,
        taskLabels,
        taskId
      );

      //@ts-ignore
      taskOfStudent.grades = makeGradesMap(grades);
      taskOfStudent.overallGrade = calculateGrade(grades);
      // .reduce((gradesMap:any,gradeObj:any)=>({
      //   ...gradesMap,

      // }),{});
      return taskOfStudent;
    })
  );
  // // .reduce((gradesMap: any,gradeObj:any )=>(
  //   {...gradesMap,
  //   [gradeObj.s]}
  // ));
  return details;
};

const changeTaskStatus: (
  taskOfStudentId: string,
  newStatus: string,
  submitUrl?: string
) => Promise<Array<any> | Error> = async (
  taskOfStudentId: string,
  newStatus: string,
  submitUrl?: string
) => {
  const toUpdate = submitUrl
    ? { status: newStatus, submitLink: submitUrl }
    : { status: newStatus };

  return TaskofStudent.update(toUpdate, { where: { id: taskOfStudentId } });
};

router.use("/challenges", challenges);

router.get(
  "/byteacherid/:id",
  validateTeacher,
  async (req: Request, res: Response) => {
    const { filters } = req.query;
    const parsedFilters = parseFilters(filters as string);

    try {
      const tosWhereCLause: any = {
        created_by: req.params.id,
      };
      const studentWhereClause: any = parsedFilters.student;
      Object.assign(tosWhereCLause, parsedFilters.task);

      //#region
      // const myTasks: any[] = await Promise.all(
      //   (
      //     await Task.findAll({
      //       where: tosWhereCLause,
      //       include: [
      //         {
      //           model: TaskofStudent,
      //           attributes: ["studentId", "status", "submitLink", "updatedAt"],
      //           required: true,
      //           include: [
      //             {
      //               model: Student,
      //               attributes: ["firstName", "lastName"],
      //               required: true,
      //               include: [
      //                 {
      //                   model: Class,
      //                   required: true,
      //                   attributes: ["id", "name", "endingDate"],
      //                   where: studentWhereClause,
      //                 },
      //               ],
      //             },
      //           ],
      //         },
      //         {
      //           model: Lesson,
      //           attributes: ["title"],
      //         },
      //         {
      //           model: TaskLabel,
      //           include: [{ model: Criterion }, { model: Label }],
      //         },
      //       ],
      //       order: [["createdAt", "DESC"]],
      //     })
      //   ).map(async (task: any) => {
      //     task = task.toJSON();
      //     const getGrades = async () => {
      //       const allStudentGrades: any = await Promise
      //         .all(task.TaskofStudents.map(async (tos: ITaskofStudent) => {
      //           const result = await getGradesOfTaskForStudent(tos.studentId, task.TaskLabels, task.id);
      //           return { result, studentId: tos.studentId }
      //         }))
      //       return allStudentGrades.reduce((gradesMap: any, tos: any) =>
      //         ({
      //           ...gradesMap,
      //           [tos.studentId]: tos.result
      //         })
      //       , {})
      //     }
      //     task.Grades = await getGrades();
      //     return task;
      //   })
      // );
      //#endregion

      const myTasks: any[] = await Task.findAll({
        where: tosWhereCLause,
        include: [
          {
            model: TaskofStudent,
            attributes: ["studentId", "status", "submitLink", "updatedAt"],
            required: true,
            include: [
              {
                model: Student,
                attributes: ["id"],
                required: true,
                include: [
                  {
                    model: Class,
                    required: true,
                    attributes: ["id"],
                    where: studentWhereClause,
                  },
                ],
              },
            ],
          },
          {
            model: TaskLabel,
            include: [{ model: Criterion }, { model: Label }],
          },
          {
            model: Lesson,
            attributes: ["title"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.json(myTasks);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/details/:taskid",
  validateTeacher,
  async (req: Request, res: Response) => {
    try {
      const taskId: number = Number(req.params.taskid);
      const details = await getTaskDetails(taskId);

      return res.json(details);
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: e });
    }
  }
);

router.get("/bystudentid/:id", async (req: Request, res: Response) => {
  try {
    const myTasks: ITaskofStudent[] = await TaskofStudent.findAll({
      where: { student_id: req.params.id },
      attributes: ["id", "status", "submitLink"],
      include: [
        {
          model: Task,
          include: [{ model: Lesson, attributes: ["id", "title"] }],
          where: { status: "active" },
        },
      ],
    });
    return res.json(myTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/toclass/:classid",
  validateTeacher,
  async (req: Request, res: Response) => {
    try {
      const task = await createTask(req, res);
      const classStudents = await Class.findByPk(req.params.classid, {
        attributes: ["id", "name"],
        include: [
          {
            model: Student,
            attributes: ["id"],
          },
        ],
      });
      const idArr = classStudents.Students;
      if (task) {
        const taskArr = await idArr.map(
          (student: any): ITaskofStudent => {
            return {
              studentId: student.id,
              //@ts-ignore
              taskId: task.id,
              //@ts-ignore
              type: task.type,
              status: "pending",
              submitLink: "",
              description: "",
            };
          }
        );

        await TaskofStudent.bulkCreate(taskArr);
      }

      return res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//posts a single toask to 1 or more students
router.post(
  "/tostudents",
  validateTeacher,
  async (req: Request, res: Response) => {
    try {
      const task = await createTask(req, res);
      const { idArr } = req.body;
      if (task) {
        const taskArr = await idArr.map(
          (studentId: number): ITaskofStudent => {
            return {
              studentId: studentId,
              //@ts-ignore
              taskId: task.id,
              //@ts-ignore
              type: task.type,
              status: "pending",
              submitLink: "",
              description: "",
            };
          }
        );

        const tasksofstudents: ITaskofStudent[] = await TaskofStudent.bulkCreate(
          taskArr
        );
      }

      return res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//labels

router.post("/label", async (req: Request, res: Response) => {
  //TODO check taskId exists
  const data: ITaskLabel[] = req.body;
  // console.log(data);
  if (!Array.isArray(data))
    res
      .status(400)
      .json({ error: `Expected an array but got ${typeof data} instead` });
  try {
    const newTaskLabels: ITaskLabel[] = await TaskLabel.bulkCreate(data);
    res.json(newTaskLabels);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/criterion", async (req: Request, res: Response) => {
  //TODO check taskId exists
  //TODO check labelId exists

  const data: ICriterion[] = req.body;
  if (!Array.isArray(data))
    res
      .status(400)
      .json({ error: `Expected an array but got ${typeof data} instead` });
  try {
    const newCriterion: ICriterion[] = await Criterion.bulkCreate(data);
    res.json(newCriterion);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

//todo support 3rd party apps fcc/challengeme

router.put("/submit/:id", async (req: Request, res: Response) => {
  try {
    const taskType: any = await TaskofStudent.findByPk(req.params.id, {
      attributes: ["type"],
    });

    if (taskType.type === "manual") {
      await changeTaskStatus(req.params.id, "submitted", req.body.url);

      return res.status(200).json("task submitted");
    }
    return res.status(400).json({ error: "can only submit manual task" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Change task status to checked
router.patch("/check/:id", async (req: Request, res: Response) => {
  try {
    const taskType: any = await TaskofStudent.findByPk(req.params.id, {
      attributes: ["type"],
    });

    if (taskType.type === "manual") {
      await changeTaskStatus(req.params.id, "checked");

      return res.status(200).json("task checked");
    }
    return res.status(400).json({ error: "can only check manual task" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id", validateTeacher, async (req: Request, res: Response) => {
  const taskRowFieldNames: string[] = [
    "id",
    "lessonId",
    "externalId",
    "externalLink",
    "createdBy",
    "endDate",
    "type",
    "status",
    "body",
    "title",
  ];
  try {
    const task = req.body;
    const taskRowDetails: Partial<ITask> = Object.keys(task).reduce(
      (outcome: Partial<ITask>, key: string) =>
        taskRowFieldNames.includes(key)
          ? { ...outcome, [key]: task[key] }
          : outcome,
      {}
    );

    const { error } = taskSchemaToPut.validate(taskRowDetails);
    if (error) return res.status(400).json({ error: error.message });
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "task id not supplied" });
    const updated = await Task.update(taskRowDetails, {
      where: { id },
    });
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", validateTeacher, async (req: Request, res: Response) => {
  try {
    const deleted = await Task.destroy({ where: { id: req.params.id } });
    const deleteFromStudents = await TaskofStudent.destroy({
      where: { taskId: req.params.id },
    });
    return res.status(200).json({
      message: `Task deleted from ${deleted} lesson and ${deleteFromStudents} students`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// //* checks submitted external task
router.post("/checksubmit/:studentId", async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const updated: ITaskofStudent[] = [];
  try {
    const unfinishedTasks: any = await TaskofStudent.findAll({
      where: {
        studentId: studentId,
        type: !"manual",
        status: !"submitted",
      },
      include: [Task],
    });

    unfinishedTasks.forEach(async (task: any) => {
      switch (task.type) {
        case "fcc":
          try {
            const event: any = await Event.findOne({
              where: {
                userId: studentId,
                eventName: "FCC_BULK_SUCCESS",
                relatedId: task.Task.externalId,
              },
            });
            if (event) {
              const updatedTask: ITaskofStudent = await TaskofStudent.update(
                {
                  status: "submitted",
                },
                { where: { id: task.id } }
              );
              updated.push(updatedTask);
            }
            return;
          } catch (error) {
            return;
          }
        case "challengeMe":
          try {
            const event: any = await Event.findOne({
              where: {
                userId: studentId,
                eventName: "CM_SUBMITTED_CHALLENGE_SUCCESS",
                relatedId: task.Task.externalId,
              },
            });
            if (event) {
              const updatedTask: ITaskofStudent = await TaskofStudent.update(
                {
                  status: "submitted",
                },
                { where: { id: task.id } }
              );
              updated.push(updatedTask);
            } else {
              const event: any = await Event.findOne({
                where: {
                  userId: studentId,
                  eventName: "CM_STARTED_CHALLENGE",
                  relatedId: task.Task.externalId,
                },
              });
              if (event) {
                const updatedTask: ITaskofStudent = await TaskofStudent.update(
                  {
                    status: "started",
                  },
                  { where: { id: task.id } }
                );
                updated.push(updatedTask);
              }
            }
          } catch (error) {
            return;
          }
        default:
          break;
      }
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
