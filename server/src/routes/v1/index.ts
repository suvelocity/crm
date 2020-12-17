import { Request, Response, Router } from "express";
import { checkToken } from "../../helper";

require("dotenv").config();

const router = Router();

const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).send({ error: "unknown endpoint" });
};

router.use("/auth", require("./auth"));
router.use(checkToken);
router.use("/class", require("./class"));
router.use("/job", require("./job"));
router.use("/student", require("./student"));
router.use("/event", require("./event"));
router.use("/M", require("./mentor"));
router.use("/company", require("./company"));
// classroom routes
router.use("/lesson", require("./lesson"));
router.use("/task", require("./task"));
router.use("/notice", require("./notice"));

router.use(unknownEndpoint);
module.exports = router;
