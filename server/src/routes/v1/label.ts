import { Router, Request, Response } from "express";
import { Op } from "sequelize";
//@ts-ignore
import { Label } from "../../models";
import { ILabel } from "../../types";
const router = Router();

router.get("/all", async (req: Request, res: Response) => {
  const searchQuery: string = req.query.search as string;
  const whereClause: any = {};

  if (searchQuery) {
    whereClause.name = { [Op.like]: `%${searchQuery}%` };
  }

  try {
    const labels: ILabel = await Label.findAll({
      where: whereClause,
    });
    res.json(labels);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const data: Partial<ILabel>[] = req.body;
  //TODO add validation
  try {
    const newLabel: ILabel = await Label.bulkCreate(data);
    res.json(newLabel);
  } catch (err) {
    console.log(err);
    res.json({ error: err });
  }
});

module.exports = router;
