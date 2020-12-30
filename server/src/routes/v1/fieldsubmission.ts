import { Router, Request, Response } from "express";
//@ts-ignore
import { FieldSubmission, Form, Field } from "../../models";
//@ts-ignore
import { SelectedOption, Option, Student } from "../../models";
//@ts-ignore
import db from "../../models/index";

import {
  quizSubmissionSchema,
  quizSubmissionSchemaToPut,
} from "../../validations";
import { IFormSubmission } from "../../types";
import { required } from "joi";

const router = Router();

// GET ALL FORM-SUBMISSIONS
router.get("/all", async (req: Request, res: Response) => {
  const submissions = await FieldSubmission.findAll({
    raw: true,
    include: [
      {
        model: Field,
        required: false,
        as: "fields",
        attributes: [],
      },
    ],
    attributes: ["studentId", [db.Sequelize.col("fields.form_id"), "formId"]],
    group: ["studentId", "formId"],
  });
  return res.json(submissions);
});

// GET QUIZ-SUBMISSIONS BY studentId
router.get("/bystudent/:id", async (req: Request, res: Response) => {
  const submissions = await FieldSubmission.findAll({
    raw: true,
    include: [
      {
        model: Field,
        required: false,
        as: "fields",
        attributes: [],
      },
    ],
    attributes: [[db.Sequelize.col("fields.form_id"), "formId"]],
    where: {
      studentId: req.params.id,
    },
  });
  return res.json(submissions);
});
// GET QUIZ-SUBMISSIONS WITH CONTENT BY studentId
router.get("/:id/full", async (req: Request, res: Response) => {
  const submissions = await FieldSubmission.findAll({
    raw: true,
    include: [
      {
        model: Field,
        required: false,
        as: "fields",
        attributes: ["id", "title"],
      },
      {
        model: SelectedOption,
        attributes: [],
        include: [
          {
            model: Option,
            attributes: ["id", "title"],
          },
        ],
      },
    ],
    attributes: [[db.Sequelize.col("fields.form_id"), "formId"], "studentId"],
    group: ["formId"],
    where: {
      studentId: req.params.id,
    },
  });
  return res.json(submissions);
});

// GET FIELD-SUBMISSIONS WITH CONTENT BY studentId
router.get("/bystudent/:id/full", async (req: Request, res: Response) => {
  const submissions = await FieldSubmission.findAll({
    raw: true,
    include: [
      {
        model: Field,
        required: false,
        as: "fields",
        attributes: ["id", "title"],
      },
      {
        model: SelectedOption,
        attributes: [],
        include: [
          { model: Option, attributes: ["id", "title"], required: true },
        ],
      },
    ],
    attributes: [[db.Sequelize.col("fields.form_id"), "formId"], "studentId"],
    // group: ['formId'],
    where: {
      studentId: req.params.id,
    },
  });
  return res.json(submissions);
});

// GET FORM-SUBMISSIONS WITH CONTENT BY fromId
router.get("/byform/:id/full", async (req: Request, res: Response) => {
  const submissions = await FieldSubmission.findAll({
    raw: true,
    include: [
      {
        model: Field,
        required: false,
        as: "fields",
        attributes: ["id", "title"],
      },
      {
        model: SelectedOption,
        attributes: [],
        include: [
          { model: Option, attributes: ["id", "title"], required: true },
        ],
      },
      {
        model: Student,
        attributes: ["firstName", "lastName"],
      },
    ],
    attributes: [[db.Sequelize.col("fields.form_id"), "formId"], "studentId"],
    // group: ['formId'],
    where: db.Sequelize.where(
      db.Sequelize.col("fields.form_id"),
      req.params.id
    ),
  });
  return res.json(submissions);
});

router.post("/form", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    // const { studentId, fieldId, textualAnswer } = body;
    const fieldSubsArr = body.map((fieldSub: any) => ({
      studentId: fieldSub.studentId,
      fieldId: fieldSub.fieldId,
      textualAnswer: fieldSub.textualAnswer,
    }));
    // const { error } = FormSubmission.validate(formSubmission);
    // if(error) {return res.status(400).json(error.message)};
    // const formattedFormSubmission = formSubmission.map(())
    const createdFieldSubmissions = await FieldSubmission.bulkCreate(
      fieldSubsArr
    );
    return res.json("field subs created successfully");
  } catch (error) {
    return res.status(400).json(error.message);
  }
});
router.post("/quiz", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const answers = body.answersArray; /// validate
    const { studentId } = body;
    let fieldSubs: any = [];
    answers.forEach((answer: any) => {
      fieldSubs.push({
        studentId,
        fieldId: answer.fieldId,
      });
    });

    const createdFieldSubmissions = await FieldSubmission.bulkCreate(
      fieldSubs,
      { returning: true }
    );
    const optionSubs: any = [];
    createdFieldSubmissions.forEach((fieldSub: any) => {
      const fieldSubmissionsId = fieldSub.id;

      const fieldId = fieldSub.fieldId;
      const optionId = answers.find((answer: any) => answer.fieldId === fieldId)
        .optionId;
      optionSubs.push({
        fieldSubmissionsId,
        optionId,
      });
    });
    const createdSelectedOptions = await SelectedOption.bulkCreate(optionSubs);
    return res.json({ createdFieldSubmissions, createdSelectedOptions });
    // return res.json(fieldSubs);
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

// POST A NEW SUBMISSION
// router.post("/", async (req: Request, res: Response) => {
//   let body = req.body;
//   if (!body.answersSelected) {
//     return res
//       .status(401)
//       .json({message: "Failed to submit quiz, property 'answersSelected' is missing!"});
//   } else if(!body.userId) {
//     return res.status(401).json({message: "Failed to submit quiz, property 'userId' is missing!"});
//   } else if(!body.quizId) {
//     return res.status(401).json({message: "Failed to submit quiz, property 'quizId' is missing!"});
//   } else {
//     const submissionByThisUser = await FieldSubmission.findOne({
//       where: {
//         quizId: body.quizId,
//         userId: body.userId,
//       },
//     });
//     // "This user already submitted this quiz!"
//     if (submissionByThisUser) {
//       res.status(401).json({message: "Failed to submit quiz, user already submitted this quiz!"});
//     } else {
//       const answersSelected = body.answersSelected;
//       const quizId = body.quizId;
//       const userId = body.userId;
//       const correctAnswersArray = await (await Quiz.findByPk(quizId)).getQuestions({
//         attributes: ["id"],
//         include: [
//           {
//             model: Field,
//             attributes: ["id"],
//             where: {
//               isCorrect: true,
//             },
//           },
//         ],
//       });
//       const rank = calcRank(correctAnswersArray, answersSelected);
//       const newSubmission = await FieldSubmission.create({ userId, quizId, rank});
//       return (newSubmission) ? res.json(newSubmission) : res.status(404).json("failed to create submission")
//     }
//   }
//   // res.json(body)
// });
// router.post('/', async (req: Request, res: Response) => {
//   try {
//     let body: IFormSubmission = req.body;
//     const newQuizSubmission: IFormSubmission = {
//       quizId: body.quizId,
//       studentId: body.studentId,
//       rank: body.rank
//     }
//     const { error } = quizSubmissionSchema.validate(newQuizSubmission);
//     if(error) return res.status(400).json({ error: error.message });
//     const createdQuizSubmission: IFormSubmission = await Quiz.create(req.body);
//     res.json(createdQuizSubmission);
//   }
//   catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

module.exports = router;
