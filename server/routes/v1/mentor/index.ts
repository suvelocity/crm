import { Request, Response, Router } from "express";

const router = Router();

const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).send({ error: "unknown endpoint" });
};

router.use("/meeting", require("./meeting"));
router.use("/classes", require("./classes"));
router.use("/mentor", require("./mentor"));

router.use(unknownEndpoint);
module.exports = router;