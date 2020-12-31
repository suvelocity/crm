import { Request, Response, Router } from "express";
import {  fetchFCC } from "../../helper";
import challengeMe from './challengeMe'
import { checkToken, validateAdmin } from "../../middlewares";
require("dotenv").config();

const router = Router();

const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).send({ error: "unknown endpoint" });
};

router.use("/challengeMe", challengeMe);
router.use("/auth", require("./auth"));
router.use("/event", require("./event")); // needs to be above the token for ChallengeMe to access, has it inside 

router.use(checkToken);

router.use("/class", validateAdmin, require("./class"));
router.use("/job", validateAdmin, require("./job"));
router.use("/student", require("./student"));
router.use("/teacher", validateAdmin, require("./teacher"));
router.use("/M", require("./mentor"));
router.use("/company", validateAdmin, require("./company"));
// classroom routes
router.use("/lesson", require("./lesson"));
router.use("/task", require("./task"));
router.use("/notice", require("./notice"));
// quizme routes
router.use("/form", require("./form"));
router.use("/fieldsubmission", require("./fieldsubmission"));

router.use(unknownEndpoint);
export default router;
