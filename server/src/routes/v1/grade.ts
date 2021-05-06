import { Router, Request, Response } from "express";
import { calculateGrade, getGradesOfTaskForStudent } from "../../helper";
//@ts-ignore
import { Grade, Task, TaskLabel, Criterion, Label } from "../../models";
import { IGrade, ITask, ITaskLabel } from "../../types";
const router = Router();

router.get(
  "/overall/:taskId/:studentId",
  async (req: Request, res: Response) => {
    const taskId: string = req.params.taskId;
    const studentId: string = req.params.studentId;

    try {
      const task: ITask = (
        await Task.findByPk(taskId, {
          include: [
            {
              model: TaskLabel,
              include: [{ model: Criterion }, { model: Label }],
            },
          ],
        })
      ).toJSON();

      const grades: ITaskLabel[] = await getGradesOfTaskForStudent(
        Number(studentId),
        //@ts-ignore
        task.TaskLabels,
        Number(taskId)
      );

      const grade = calculateGrade(grades);

      res.json({ grade });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
);

router.post("/", async (req: Request, res: Response) => {
  const type: string = req.body.type;
  //@ts-ignore
  //   const table: string | undefined = tableNames[type];
  //   if (!table)
  //     return res.status(400).json({
  //       err: "Ilegal grade type. Only task, label, criterion are allowed",
  //     });

  const gradeExists: {
    found: boolean;
    item?: IGrade;
  } = await findPkByRelatedIdInTable(req, res);

  if (gradeExists.found) return patchGrade(req, res, gradeExists.item?.id!);
  postGrade(req, res);
});

const findPkByRelatedIdInTable: (
  req: Request,
  res: Response
) => Promise<any> = async (req: Request, res: Response) => {
  const {
    belongsTo,
    belongsToId,
    studentId,
  }: { belongsTo: string; belongsToId: number; studentId: number } = req.body;
  try {
    const grade: { toJSON: () => IGrade } | null = await Grade.findOne({
      where: {
        belongsTo: belongsTo,
        belongsToId: belongsToId,
        studentId: studentId,
      },
    });
    if (grade === null || !grade.toJSON().id) return { found: false };

    return { found: true, item: grade.toJSON() };
  } catch (err) {
    console.log(err);
    return { found: false };
  }
};

const postGrade: (req: Request, res: Response) => Promise<void> = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      grade,
      belongsToId,
      belongsTo,
      studentId,
      freeText,
    }: {
      grade: number;
      belongsToId: number;
      belongsTo: "task" | "label" | "criterion";
      studentId: number;
      freeText: string | undefined;
    } = req.body;

    const newGrade: IGrade = await Grade.create({
      grade: grade,
      belongsToId: belongsToId,
      belongsTo: belongsTo,
      studentId: studentId,
      freeText: freeText,
    });

    res.json(newGrade);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

const patchGrade: (
  req: Request,
  res: Response,
  pk: number
) => Promise<void> = async (req: Request, res: Response, pk: number) => {
  try {
    const {
      grade,
      belongsToId,
      //   belongsTo,
      freeText,
    }: {
      grade: number;
      belongsToId: number;
      //   belongsTo: "task" | "label" | "criterion";
      freeText: string | undefined;
    } = req.body;
    await Grade.update(
      {
        grade: grade,
        freeText: freeText,
      },
      { where: { id: pk }, returning: true }
    );

    //TODO fix this
    const updatedGrade: IGrade = await Grade.findByPk(pk);
    console.log(updatedGrade);

    res.json(updatedGrade);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

module.exports = router;
