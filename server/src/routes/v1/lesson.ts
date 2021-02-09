import { Router, Request, Response } from "express";
const router = Router();
//@ts-ignore
import { Lesson, Class, Task, Teacher } from "../../models";
import { ILesson, IClass, ITask } from "../../types";
import { lessonSchema, lessonSchemaToPut } from "../../validations";
import { validateTeacher } from "../../middlewares";

router.post("/", validateTeacher, async (req: Request, res: Response) => {
  try {
    const { classId, title, body, resource, zoomLink, createdBy } = req.body;
    const { error } = lessonSchema.validate({
      classId,
      title,
      body,
      resource,
      zoomLink,
      createdBy,
    });
    if (error) return res.status(400).json({ error: error.message });
    const lesson: ILesson = await Lesson.create({
      classId,
      title,
      body,
      resource,
      zoomLink,
      createdBy,
    });
    return res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//find all lessons of class
router.get("/byclass/:id", async (req: Request, res: Response) => {
  try {
    const lessons: ILesson[] = await Lesson.findAll({
      where: { classId: req.params.id },
      include: [
        { model: Task },
        { model: Teacher, attributes: ["firstName", "lastName"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    if (lessons) return res.json(lessons);
    res.status(404).json({ error: "lessons not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/byclass/today/:id", async (req: Request, res: Response) => {
  try {
    const lessons: ILesson[] = await Lesson.findAll({
      limit: 1,
      where: { classId: req.params.id },
      include: [
        { model: Task },
        { model: Teacher, attributes: ["firstName", "lastName"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    if (lessons) return res.json(lessons);
    res.status(404).json({ error: "lessons not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/tasks/:lessonId", async (req, res) => {
  try {
    const { lessonId } = req.params;
    if (!lessonId) {
      return res.status(400).json({ message: "missing Id in Params" });
    }
    const tasks: ITask[] = await Task.findAll({
      where: { lessonId: lessonId },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//find a lesson by id
router.get("/byid/:id", async (req: Request, res: Response) => {
  try {
    const lesson: ILesson = await Lesson.findOne({
      where: { id: req.params.id },
      include: [
        { model: Task },
        { model: Teacher, attributes: ["firstName", "lastName"] },
      ],
    });
    if (lesson) return res.json(lesson);
    res.status(404).json({ error: "lesson not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//find all lessons of class
router.put("/:id", validateTeacher, async (req: Request, res: Response) => {
  const { error } = lessonSchemaToPut.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  try {
    const updated = await Lesson.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated[0] === 1) return res.json({ msg: "Lesson updated" });
    res.status(404).json({ error: "Lesson not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
