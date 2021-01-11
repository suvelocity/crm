import { Router, Request, Response } from "express";
const router = Router();
//@ts-ignore
import { Class, Task, TaskofStudent } from "../../models";
//@ts-ignore
import { Student, Lesson, Event, TeacherofClass } from "../../models";
//@ts-ignore
import { TaskLabel, Criterion, Grade } from "../../models";
import {
  IClass,
  ICriterion,
  IGrade,
  ITask,
  ITaskFilter,
  ITaskLabel,
  ITaskofStudent,
} from "../../types";
import { taskSchema } from "../../validations";
import { parseFilters } from "../../helper";
import challenges from "./challenges";
import { validateTeacher } from "../../middlewares";

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
  });
  if (error) return res.status(400).json({ error: error.message });
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
  return task;
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
                attributes: ["firstName", "lastName"],
                required: true,
                include: [
                  {
                    model: Class,
                    required: true,
                    attributes: ["id", "name", "endingDate"],
                    where: studentWhereClause,
                  },
                ],
              },
            ],
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
      res.status(500).json({ error: error.message });
    }
  }
);

router.get("/options/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;
  if (!id) res.status(400).json({ error: "Malformed data" });
  const options: any = {};

  try {
    const classes: any[] = await TeacherofClass.findAll({
      where: { teacher_id: id },
      attributes: ["id"],
      include: [{ model: Class, attributes: ["name"] }],
    });

    options.classes = classes.map((cls: any) => cls.Class.name);
    options.taskTypes = ["fcc", "Manual", "challengeMe", "quiz"];

    res.json(options);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
  console.log(data);
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
  console.log(data);
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

router.post("/grade", async (req: Request, res: Response) => {
  //TODO check taskId exists
  //TODO check labelId exists

  const data: IGrade[] = req.body;
  console.log(data);
  if (!Array.isArray(data))
    res
      .status(400)
      .json({ error: `Expected an array but got ${typeof data} instead` });
  try {
    const newGrade: IGrade[] = await Grade.bulkCreate(data);
    res.json(newGrade);
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
      await TaskofStudent.update(
        {
          submitLink: req.body.url,
          status: "done",
        },
        { where: { id: req.params.id } }
      );
      return res.status(200).json("task updated");
    }
    return res.status(200).json({ error: "can only update manual task" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id", validateTeacher, async (req: Request, res: Response) => {
  try {
    const task = req.body;
    const { error } = taskSchema.validate(task);
    if (error) return res.status(400).json({ error: error.message });
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "task id not supplied" });
    const updated = await Task.update(task, {
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
        status: !"done",
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
                  status: "done",
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
                  status: "done",
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
