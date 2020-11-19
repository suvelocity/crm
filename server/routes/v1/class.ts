import { Router, Request, Response } from "express";
const router = Router();
//@ts-ignore
import { Student, Job, Event, Class } from "../../models";
import { IStudent, IJob, IClass } from "../../types";

router.get("/", async (req: Request, res: Response) => {
  try {
    const classes: IClass[] = await Class.findAll({
      includes: [
        {
          models: Student,
        },
      ],
    });
    res.json(classes);
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
    res.status(500).send("error occurred");
  }
});

//   newClassRoom
//     .save()
//     .then((cls: IClassRoom) => res.json(cls))
//     .catch((e: Error) => res.sendStatus(400));
// });

// router.put("/:id", (req: Request, res: Response) => {
//   const id: string = req.params.id;
//   ClassRoom.findByIdAndUpdate(id, req.body, { new: true })
//     .then((classRoom: IClassRoom | null) => res.json(classRoom))
//     .catch((e: Error) => res.sendStatus(400));
// });

// router.delete("/:id", (req: Request, res: Response) => {
//   ClassRoom.findByIdAndDelete(req.params.id)
//     .then(() => res.status(204).json({ success: true }))
//     .catch((e: Error) => res.sendStatus(500));
// });

module.exports = router;
