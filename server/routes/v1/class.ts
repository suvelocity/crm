import { Router, Request, Response } from "express";
const router = Router();
//@ts-ignore
import { Student, Class } from "../../models";
import { IClass } from "../../types";

import { classSchema, classSchemaToPut } from "../../validations";
router.get("/all", async (req: Request, res: Response) => {
  try {
    const classes: IClass[] = await Class.findAll({
      include: [
        {
          model: Student,
        },
      ],
    });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/byId/:id", async (req: Request, res: Response) => {
  try {
    const selectedClass: IClass[] = await Class.findByPk(req.params.id, {
      include: [
        {
          model: Student,
        },
      ],
    });
    if (selectedClass) return res.json(selectedClass);
    res.status(404).json({ error: "Class not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const body: IClass = req.body;
    const newClass: IClass = {
      course: body.course,
      name: body.name,
      startingDate: body.startingDate,
      endingDate: body.endingDate,
      cycleNumber: body.cycleNumber,
      zoomLink: body.zoomLink,
      additionalDetails: body.additionalDetails,
    };
    const { error } = classSchema.validate(newClass);
    if (error) return res.status(400).json({ error: error.message });
    const createdClass: IClass = await Class.create(newClass);
    res.json(createdClass);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { value, error } = classSchemaToPut.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const updated = await Class.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated[0] === 1) return res.json({ message: "Class updated" });
    res.status(404).json({ error: "Class not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Class.destroy({
      where: { id },
    });
    if (deleted === 0) {
      return res.status(404).send("Class not found");
    } else {
      await Student.destroy({ where: { classId: id } });
      res.json({ message: "Class deleted" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
