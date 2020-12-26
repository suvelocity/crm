import e, { Router, Request, Response } from "express";
//@ts-ignore
import { FieldSubmission, Form, Field, SelectedOption, Option, Student } from "../../models";
//@ts-ignore
import db from "../../models/index";
import {Op, QueryInterface} from 'sequelize'
import {
  formSubmissionSchema,
  formSubmissionSchemaToPut,
} from "../../validations";
import {IFormFieldSubmission,IFormOption, IOption} from '../../types'
import { array, required } from "joi";
import selectedoption from "../../models/selectedoption";
import { update } from "lodash";
// import {IOption} from '../../../../client/src/typescript/interfaces

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
    group: ['studentId', 'formId']
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
      studentId: req.params.id
    }
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
        attributes: ["id", 'title']
      },
      {
        model: SelectedOption,
        attributes: [],
        include: [
          {
            model: Option, 
            attributes: ['id', 'title']
          }
        ]    
      }
    ],
    attributes: [[db.Sequelize.col("fields.form_id"), "formId"], 'studentId'],
    group: ['formId'],
    where: {
      studentId: req.params.id
    }
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
        attributes: ["id", 'title']
      },
      {
        model: SelectedOption,
        attributes: [],
        include: [{model: Option, attributes: ['id', 'title'], required: true}]    
      }
    ],
    attributes: [[db.Sequelize.col("fields.form_id"), "formId"], 'studentId'],
    // group: ['formId'],
    where: {
      studentId: req.params.id
    }
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
        attributes: ["id", 'title']
      },
      {
        model: SelectedOption,
        attributes: [],
        include: [{model: Option, attributes: ['id', 'title'], required: true}]    
      }, 
      {
        model: Student, 
        attributes: ['firstName','lastName' ]
      }
    ],
    attributes: [[db.Sequelize.col("fields.form_id"), "formId"], 'studentId'],
    // group: ['formId'],
    where: db.Sequelize.where(db.Sequelize.col("fields.form_id"), req.params.id)
  });
  return res.json(submissions);
});



router.post('/form', async (req: Request, res: Response) => {
  async function updateOrCreateField(studentId:number,fieldId:number, textualAnswer:string|undefined){
    try{
      let {0:submission,1:createdNew}:{0:{id:number},1:boolean} = await FieldSubmission.findOrCreate({
        where:{studentId,fieldId},
        defaults:{studentId,fieldId,textualAnswer},
        attributes:{include:['id']},
      })
      if(createdNew){
        submission = await FieldSubmission.findOne({
          where:{[Op.and]:{studentId,fieldId}},
          attributes:{include:['id']},
        })
        console.log('sub:',submission) 
        throw 'mf'
      }
      const {id} = submission
      return {id,textualAnswer,createdNew}
    }catch(err){
      console.log(err)
      return {
        status:'error',
        message:err.message,
      }
    }
      
  }
  async function insertOptionsField(createdNew:boolean,submissionId:number,answer:IOption[]){
    try{
      const qi :QueryInterface= db.sequelize.getQueryInterface()
      if(!createdNew){
        qi.bulkDelete('SelectedOptions',{field_submission_id:submissionId})
        .catch(e=>console.error(e.message))
      }
      const added = await qi.bulkInsert('SelectedOptions',
        answer.map(({id})=>({
          option_id:id,field_submission_id:submissionId
        })))
      return { status:'success' }
    }catch(err){
      console.trace(err)
      return {
        status:'error',
        message:err.message,
      }
    }
  }
  try {
    interface submission{
      studentId:number;
      fieldId: number;
      answer: 'string'|IOption[]
    }
    const body:submission[] = req.body;
    const submissions = await Promise.all(body.map( async ({studentId,fieldId,answer})=>{
      const {id:submissionId,textualAnswer,createdNew,status,message} = await updateOrCreateField(
        studentId,
        fieldId,
        typeof answer === 'string'
        ? answer : undefined
      )
      if( status==='error'){
        return {
          status:'error',
          message:message,  
        }
      }else if(textualAnswer){
        return {status:'success'}
      }else{
        //@ts-ignore
        const {status,message} =await insertOptionsField(createdNew,submissionId,answer)
        if( status==='error'){
          return {
            status:'error',
            message:message,  
          }
        } else {
          return {status:'success'}
        }
      }

    })
    )
    if(!Array.isArray(submissions)){
      res.status(400).json(submissions)
    }else{
      res.status(201).send('success')
    }
  }
  catch(error) {
    return res.status(400).json(error.message);
  }
});

router.post('/quiz', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const answers = body.answersArray; /// validate
    const { studentId } = body; 
    let fieldSubs: any = [];
    answers.forEach((answer: any) => {
      fieldSubs.push({
        studentId,
        fieldId: answer.fieldId
      });
    }); 
    const createdFieldSubmissions = await FieldSubmission.bulkCreate(fieldSubs);
    const createdFieldSubmissionsWithId = await FieldSubmission.findAll({
      where: {
        studentId: fieldSubs[0].studentId,
        createdAt: createdFieldSubmissions[0].createdAt
      },
      attributes: ['id', 'fieldId']
    }); 
    const optionSubs: any = [];
    createdFieldSubmissionsWithId.forEach((fieldSub: any) => {
      const fieldSubmissionId = fieldSub.id;
      const fieldId = fieldSub.fieldId;
      const optionId = answers.find((answer: any) => answer.fieldId === fieldId).optionId;
      optionSubs.push({
        fieldSubmissionId,
        optionId
      });
    });
    const createdSelectedOptions = await SelectedOption.bulkCreate(optionSubs);
    return res.json({createdFieldSubmissions, createdSelectedOptions});
  }
  catch(error) {
    return res.status(400).json(error.message);
  }
});


// POST A NEW SUBMISSION
// router.post("/", async (req: Request, res: Response) => {
//   let body = req.body;
//   if (!body.answersSelected) {
//     return res
//       .status(403)
//       .json({message: "Failed to submit quiz, property 'answersSelected' is missing!"});
//   } else if(!body.userId) {
//     return res.status(403).json({message: "Failed to submit quiz, property 'userId' is missing!"});
//   } else if(!body.quizId) {
//     return res.status(403).json({message: "Failed to submit quiz, property 'quizId' is missing!"});
//   } else {
//     const submissionByThisUser = await FieldSubmission.findOne({
//       where: {
//         quizId: body.quizId,
//         userId: body.userId,
//       },
//     });
//     // "This user already submitted this quiz!"
//     if (submissionByThisUser) {
//       res.status(403).json({message: "Failed to submit quiz, user already submitted this quiz!"});
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
//     let body: IQuizSubmission = req.body;
//     const newQuizSubmission: IQuizSubmission = {
//       quizId: body.quizId,
//       studentId: body.studentId,
//       rank: body.rank
//     }
//     const { error } = quizSubmissionSchema.validate(newQuizSubmission);
//     if(error) return res.status(400).json({ error: error.message });
//     const createdQuizSubmission: IQuizSubmission = await Quiz.create(req.body);
//     res.json(createdQuizSubmission);
//   }
//   catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

module.exports = router;
