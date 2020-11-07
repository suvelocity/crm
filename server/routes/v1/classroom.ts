import { Router, Request, Response } from "express";
import Class, { IClass } from "../../models/class.model";
const router = Router();

router.get("/", (req: Request, res: Response) => {
  Class.find()
    .then((classes: IClass[]) => res.json(classes))
    .catch((e: Error) => res.sendStatus(500));
});

router.post("/", (req: Request, res: Response) => {
  const newClass: IClass = new Class({
    name: req.body.name,
    courseName: req.body.courseName,
    cycleNumber: +req.body.cycleNumber,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    zoomLink: req.body.zoomLink,
  });

  newClass
    .save()
    .then((doc: IClass) => res.json(doc))
    .catch((e: Error) => res.sendStatus(400));
});

module.exports = router;
