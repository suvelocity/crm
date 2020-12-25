import { Router, Request, Response } from "express";
const router = Router();
//@ts-ignore
import { Teacher, Notice } from "../../models";
import { INotice } from "../../types";
import { noticeSchema } from "../../validations";

//create a nottice
router.post("/", async (req: Request, res: Response) => {
  try {
    const { classId, type, body, createdBy } = req.body;
    const { error } = noticeSchema.validate({
      classId,
      type,
      body,
      createdBy,
    });
    if (error) return res.status(400).json({ error: error.message });
    const notice: INotice = await Notice.create({
      classId,
      type,
      body,
      createdBy,
    });
    return res.json(notice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//find all notices of class
router.get("/byclass/:id", async (req: Request, res: Response) => {
  const paramsId: string = req.params.id;
  try {
    const notices: INotice[] = await Notice.findAll({
      where: { classId: paramsId },
      include: [{ model: Teacher, attributes: ["firstName", "lastName"] }],
      // order: [["createdAt", "DESC"]],
    });
    if (notices) return res.json(notices);
    res.status(404).json({ error: "notices not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/byid/:id", async (req: Request, res: Response) => {
  const paramsId: string = req.params.id;
  try {
    await Notice.update(
      {
        body: req.body.body,
      },
      { where: { id: paramsId } }
    );
    return res.json("updated sucsessfuly");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const paramsId: string = req.params.id;
  try {
    await Notice.destroy({ where: { id: paramsId } });
    return res.json("notice deleted sucsessfuly");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
