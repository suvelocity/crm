import { Router, Request, Response } from "express";
const router = Router();
//@ts-ignore
import { Student, Job, Event, Class } from "../../models";
import { IStudent, IJob, IClass } from "../../types";

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
  } catch (err) {
    res.status(500).send("error occurred");
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
    res.status(404).send("Class not found");
  } catch (err) {
    res.status(500).send("error occurred");
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
    const createdClass: IClass = await Class.create(newClass);
    res.json(createdClass);
  } catch (err) {
    console.log(err);
    res.status(500).send("error occurred");
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const updated = await Class.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated[0] === 1) return res.json({ msg: "Class updated" });
    res.status(404).send("Class not found");
  } catch (e) {
    res.status(500).send("error occurred");
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deleted = await Class.destroy({
      where: { id: req.params.id },
    });
    if (deleted === 0) {
      return res.status(404).send("Class not found");
    }
    res.json({ msg: "Class deleted" });
  } catch (e) {
    res.status(500).send("error occurred");
  }
});

module.exports = router;
