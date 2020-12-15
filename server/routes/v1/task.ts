import { Router, Request, Response } from "express";
const router = Router();
//@ts-ignore
import { Class, Task, TaskofStudent } from "../../models";
//@ts-ignore
import { Student, Lesson, Event } from "../../models";
import { ITask, ITaskofStudent } from "../../types";
import { taskSchema } from "../../validations";

//todo support post of array of tasks
//posts a single task to db and gives all students this task
router.post("/:classid", async (req: Request, res: Response) => {
  try {
    const {
      lessonId,
      externalId,
      externalLink,
      createdBy,
      endDate,
      type,
      status,
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
      body,
    });

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
            userId: student.id,
            //@ts-ignore
            taskId: task.id,
            type: task.type,
            status: "pending",
            submitLink: "",
          };
        }
      );

      const tasksofstudents: ITaskofStudent[] = await TaskofStudent.bulkCreate(
        taskArr
      );
    }

    return res.json(task);
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
            const event: any = await Event.findAll({
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

module.exports = router;
