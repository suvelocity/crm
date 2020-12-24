import { Router, Request, Response,RequestHandler } from 'express';
//@ts-ignore
import { Form, Field, Option } from "../../models";
//@ts-ignore
import db from "../../models/index";
import { formSchema, formSchemaToPut } from "../../validations";
import { IForm } from "../../types";
import { networkInterfaces } from 'os';
import { QueryInterface } from 'sequelize/types';
import jwt from 'jsonwebtoken'
const router = Router();

 const validateAccess :RequestHandler = async (req,res,next)=>{
  const auth = await jwt.verify( req.headers.authorization!.slice(7),process.env.ACCESS_TOKEN_SECRET!)
  console.log(auth)
  next()
}

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
router.get('/:id',validateAccess, async (req: Request, res: Response) => {
  const form = await Form.findByPk(req.params.id, {
    attributes: ["id", "name", "isQuiz"],
    include: [{model: Field, attributes: ["id", "title",'typeId'], include: [{model: Option, attributes: ['id', 'title']}]}]
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
    const { name, creatorId, isQuiz } = req.body;
    const { error } = formSchema.validate({ name, creatorId, isQuiz });
    if (error) return res.status(400).json({ error: error.message });
    const createdForm: IForm = await Form.create({ name, creatorId, isQuiz });
    res.json(createdForm);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// POST A NEW FORM FULL 
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, creatorId, isQuiz } = req.body;
    const { error } = formSchema.validate({ name, creatorId, isQuiz });
    if (error) return res.status(400).json({ error: error.message });
    const createdForm: IForm = await Form.create({ name, creatorId, isQuiz });
    res.json(createdForm);
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