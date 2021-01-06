import { Request, Response, Router } from "express";
import { validateAdmin } from "../../../middlewares";

const router = Router();

const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).send({ error: "unknown endpoint" });
};

router.use("/student", require("./student"));
router.use("/meeting", require("./meeting"));
router.use(validateAdmin)
router.use("/classes", require("./classes"));
router.use("/mentor", require("./mentor"));
router.use("/program", require("./program"));
router.use("/form", require("./form"));

router.use(unknownEndpoint);
module.exports = router;