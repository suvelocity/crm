import { Router, Request, Response } from "express";
//@ts-ignore
import { Form, Field, Option } from "../../models";
//@ts-ignore
import db from "../../models/index";
import { formSchema, formSchemaToPut } from "../../validations";
import { IForm, IField, IOption } from "../../types";
import { networkInterfaces } from "os";
import { QueryInterface } from "sequelize/types";
import { IpOptions } from "joi";

const router = Router();

// GET ALL FORMS
router.get("/all", async (req: Request, res: Response) => {
  const forms = await Form.findAll({
    attributes: ["id", "name", "isQuiz"],
  });
  return res.json(forms);
});

// GET SUBMISSIONS OF QUIZ
// router.get('/:id/submissions', async (req: Request, res: Response) => {
//   const quiz = await Quiz.findByPk(req.params.id, {
//     attributes: ["name"],
//     include: [{model: QuizSubmission, attributes: ['rank'], include: [{model: Student, attributes: ['firstName', 'lastName']}]}]
//   });
//   return res.json(quiz);
// });

// GET QUIZ BY ID
router.get("/:id", async (req: Request, res: Response) => {
  const form = await Form.findByPk(req.params.id, {
    attributes: ["id", "name", "isQuiz"],
    include: [
      {
        model: Field,
        attributes: ["id", "title"],
        include: [{ model: Option, attributes: ["id", "title"] }],
      },
    ],
  });
  return res.json(form);
});

// GET QUESTIONS OF FORM
// router.get('/:id/questions', async (req: Request, res: Response) => {
//   const quiz = await Quiz.findByPk(req.params.id);
//   const questions = await quiz.getQuestions();
//   return res.json(questions);
// });

// POST A NEW FORM FULL
router.post("/full", async (req: Request, res: Response) => {
  try {
    const { name, creatorId, isQuiz, fields } = req.body;
    const { error } = formSchema.validate({ name, creatorId, isQuiz });
    if (error) return res.status(400).json({ error: error.message });
    const createdForm: IForm & {
      createdAt: string;
      updatedAt: string;
    } = await Form.create({ name, creatorId, isQuiz });
    // res.json(createdForm);
    const createdFormId = (
      await Form.findOne({
        attributes: ["id"],
        where: {
          name: createdForm.name,
          creatorId: createdForm.creatorId,
          isQuiz: createdForm.isQuiz,
          createdAt: createdForm.createdAt,
        },
      })
    ).id;
    const fieldsArr = fields.map((field: IField) => ({
      title: field.title,
      typeId: field.typeId,
      formId: createdFormId,
    }));
    const createdFields = await Field.bulkCreate(fieldsArr);
    const createdFieldsWithId = (await Field.findAll({
      where: {
        formId: createdFormId,
        createdAt: createdFields[0].createdAt,
      }
    }));
    let optionsArr: IOption[] = [];
    fields.forEach((field: IField & {options: IOption[]}, fieldIndex: number) => {
      (field.options) && field.options.forEach((option: IOption) => {
        const isCorrect = (option.isCorrect !== undefined) ? option.isCorrect : null; 
        optionsArr.push({
          title: option.title,
          fieldId: createdFieldsWithId[fieldIndex].id,
          isCorrect: isCorrect
        });
      });
    });
    const createdOptions = await Option.bulkCreate(optionsArr)
    res.json({ optionsArr: optionsArr });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST A NEW FORM
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, creatorId, isQuiz } = req.body;
    const { error } = formSchema.validate({ name, creatorId, isQuiz });
    if (error) return res.status(400).json({ error: error.message });
    const createdForm: IForm & {
      createdAt: string;
      updatedAt: string;
    } = await Form.create({ name, creatorId, isQuiz });
    res.json(createdForm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router.patch("/:id", async (req: Request, res: Response) => {
//   try {
//     const { error } = quizSchemaToPut.validate(req.body);
//     if (error) return res.status(400).json({ error: error.message });
//     const updated = await Quiz.update(req.body, {
//       where: { id: req.params.id },
//     });
//     if (updated[0] === 1) return res.json({ message: "Quiz updated" });
//     res.status(404).json({ error: "Quiz not found" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

module.exports = router;
