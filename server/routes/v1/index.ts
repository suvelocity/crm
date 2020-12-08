import { Request, Response, Router } from "express";

const router = Router();

const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).send({ error: "unknown endpoint" });
};

router.use("/class", require("./class"));
router.use("/job", require("./job"));
router.use("/student", require("./student"));
router.use("/event", require("./event"));
router.use("/mentor", require("./mentor"));

router.use(unknownEndpoint);
module.exports = router;
