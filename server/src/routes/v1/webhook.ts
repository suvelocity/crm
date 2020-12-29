import { Router, Request, Response } from "express";
import { IEvent, IJob, IStudent } from "../../types";
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    res.status(200).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
