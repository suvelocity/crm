import { Router, Request, Response } from "express";
const router = Router();
//@ts-ignore
import { Class, Task, TaskofStudent, Student } from "../../models";
import { ILesson, IClass, ITask, ITaskofStudent } from "../../types";
import { taskSchema } from "../../validations";
// import network from "../../../client/src/helpers/network";
// import { ne } from "sequelize/types/lib/operators";

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
      where: { userId: req.params.id },
      attributes: ["id", "status"],
      include: [Task],
    });
    return res.json(myTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//todo support 3rd party apps fcc/challengeme

router.put("/bytaskid/:id", async (req: Request, res: Response) => {
  try {
    const currentStatus: any = await TaskofStudent.findByPk(req.params.id, {
      attributes: ["status"],
    });
    await TaskofStudent.update(
      {
        status: currentStatus.status === "pending" ? "done" : "pending",
      },
      { where: { id: req.params.id } }
    );
    return res.json(currentStatus.status === "pending" ? "done" : "pending");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
