import { Request, Response, Router } from "express";
//@ts-ignore
import { Student, Job, Event, Class, Mentor } from "../../../models";
import { IMentor } from "../../../types";

const router = Router();

const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).send({ error: "unknown endpoint" });
};

router.use("/meeting", require("./meeting"));
router.use("/classes", require("./classes"));
router.use("/mentor", require("./mentor"));

// get all the mentors:
router.get("/all", async (req: Request, res: Response) => {
    try {
      const mentors: IMentor[] = await Mentor.findAll();
      res.json(mentors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


router.use(unknownEndpoint);
module.exports = router;