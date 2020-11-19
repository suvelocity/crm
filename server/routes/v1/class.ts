import { Router, Request, Response } from "express";
const router = Router();

// router.get("/", (req: Request, res: Response) => {
//   ClassRoom.find()
//     .then((classes: IClassRoom[]) => res.json(classes))
//     .catch((e: Error) => res.sendStatus(500));
// });

// router.post("/", (req: Request, res: Response) => {
//   const newClassRoom: IClassRoom = new ClassRoom({
//     name: req.body.name,
//     courseName: req.body.courseName,
//     cycleNumber: +req.body.cycleNumber,
//     startDate: req.body.startDate,
//     endDate: req.body.endDate,
//     zoomLink: req.body.zoomLink,
//   });

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
