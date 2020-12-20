import { Request, Response, Router } from "express";

const router = Router();

const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).send({ error: "unknown endpoint" });
};

router.use("/meeting", require("./meeting"));
router.use("/classes", require("./classes"));
router.use("/mentor", require("./mentor"));
<<<<<<< HEAD
router.use("/program", require("./program"));
=======
>>>>>>> 660706bdb5dd7d40b47883afb379e03ee50f67bf

router.use(unknownEndpoint);
module.exports = router;