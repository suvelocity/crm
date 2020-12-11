import { Router, Request, Response } from "express";
const router = Router();
//@ts-ignore
import { Student, Class, Task, Lesson } from "../../models";
import { ILesson } from "../../types";
import { eventsSchema } from "../../validations";

router.post("/", async (req: Request, res: Response) => {
  try {
    const { classId, title, body, resource, zoomLink, createdBy } = req.body;
    const { error } = eventsSchema.validate({
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
