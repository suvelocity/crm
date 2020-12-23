import { Router, Request, Response } from 'express';
//@ts-ignore
import { Form, Field, Option } from "../../models";
//@ts-ignore
import db from "../../models/index";
import { fieldSchema, fieldSchemaToPut } from "../../validations";
import { IField } from "../../types";
import { networkInterfaces } from 'os';
import { QueryInterface } from 'sequelize/types';

const router = Router();

// GET ALL FORMS
router.get('/all', async (req: Request, res: Response) => {
  const forms = await Form.findAll({
    attributes: ['id', 'name', 'isQuiz']
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
router.get('/:id', async (req: Request, res: Response) => {
  const form = await Form.findByPk(req.params.id, {
    attributes: ["id", "name", "isQuiz"],
    include: [{model: Field, attributes: ["id", "title"], include: [{model: Option, attributes: ['id', 'title']}]}]
  });
  return res.json(form);
});

// GET QUESTIONS OF FORM
// router.get('/:id/questions', async (req: Request, res: Response) => {
//   const quiz = await Quiz.findByPk(req.params.id);
//   const questions = await quiz.getQuestions();
//   return res.json(questions);
// });

// POST A NEW FORM
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, formId, typeId} = req.body;
    const { error } = fieldSchema.validate({ title, formId, typeId });
    if (error) return res.status(400).json({ error: error.message });
    const createdFields: IField = await Form.bulkCreate({ title, formId, typeId });
    res.json(createdFields);
  }
  catch (error) {
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