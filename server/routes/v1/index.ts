import { Request, Response, Router } from "express";
import { checkToken } from "../../helper";

require("dotenv").config();

const router = Router();

const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).send({ error: "unknown endpoint" });
};

router.use("/auth", require("./auth"));

router.use("/class", checkToken, require("./class"));
router.use("/job", checkToken, require("./job"));
router.use("/student", checkToken, require("./student"));
router.use("/event", checkToken, require("./event"));
router.use("/company", checkToken, require("./company"));

router.use(unknownEndpoint);
module.exports = router;
