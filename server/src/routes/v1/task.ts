import { Router, Request, Response } from "express";
const router = Router();
//@ts-ignore
import { Class, Task, TaskofStudent } from "../../models";
//@ts-ignore
import { Student, Lesson, Event, TeacherofClass } from "../../models";
import { IClass, ITask, ITaskFilter, ITaskofStudent } from "../../types";
import { taskSchema } from "../../validations";
import { parseFilters } from "../../helper";

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

//todo support post of array of tasks
//posts a single task to entire class
router.post("/toclass/:classid", async (req: Request, res: Response) => {
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
});

//posts a single toask to 1 or more students
router.post("/tostudents", async (req: Request, res: Response) => {
  try {
    const task = await createTask(req, res);

    const { idArr } = req.body;
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
        },
      ],
    });
    return res.json(myTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//todo support 3rd party apps fcc/challengeme

router.put("/submit/:id", async (req: Request, res: Response) => {
  try {
    const taskType: any = await TaskofStudent.findByPk(req.params.id, {
      attributes: ["type"],
    });
    console.log(taskType);

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

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const task = req.body;
    const { error } = taskSchema.validate(task);
    if (error) return res.status(400).json({ error: error.message });
    const {id} = req.params;
    if(!id) return res.status(400).json({error: 'task id not supplied'})
    const updated = await Task.update(task, {
      where: {id},
    });
    return res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deleted = await Task.destroy({where: {id: req.params.id}})
    const deleteFromStudents = await TaskofStudent.destroy({where: {taskId: req.params.id}});
    console.log(deleteFromStudents)
    return res.status(200).json({message: `Task deleted from ${deleted} lesson and ${deleteFromStudents} students`});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//* checks submitted external task
router.post("/checksubmit", async (req: Request, res: Response) => {
  try {
    const unfinishedTasks: any = await TaskofStudent.findAll({
      where: {
        studentId: req.body.studentId,
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
                userId: req.body.studentId, //!check if this will be userid or studentid
                eventName: "FCC_SUBMIT_SUCCESS", //!check if this will be the name of the event
                relatedId: task.Task.externalId,
              }, //todo create this event
            });
            if (event) {
              await TaskofStudent.update(
                {
                  status: "done",
                },
                { where: { id: task.id } }
              );
            }
            return;
          } catch (error) {
            return;
          }
        case "challenge":
          try {
            const event: any = await Event.findAll({
              where: {
                userId: req.body.studentId, //!check if this will be userid or studentid
                eventName: "CHALLENGEME_SUBMIT_SUCCESS",
                relatedId: task.Task.externalId,
              }, //todo create this event
            });
            if (event) {
              await TaskofStudent.update(
                {
                  status: "done",
                },
                { where: { id: task.id } }
              );
            }
            return;
          } catch (error) {
            return;
          }

        default:
          break;
      }
    });
    res.status(200).json("updated submittions");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/byteacherid/:id", async (req: Request, res: Response) => {
  const { filters } = req.query;
  const parsedFilters = parseFilters(filters as string);

  try {
    const tosWhereCLause: any = {
      created_by: req.params.id,
    };
    const studentWhereClause: any = parsedFilters.student;
    Object.assign(tosWhereCLause, parsedFilters.task);
    console.log(tosWhereCLause);
    console.log(studentWhereClause);

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
});

router.get("/options/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;
  console.log(id);
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
module.exports = router;
