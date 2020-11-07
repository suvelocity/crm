import { Request, Response, Router } from "express";

const router = Router();

const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).send({ error: "unknown endpoint" });
};
router.use("/classroom", require("./classroom"));

router.use(unknownEndpoint);
export default router;
