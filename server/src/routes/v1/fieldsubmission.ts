import e, { Router, Request, Response, RequestHandler } from "express";
//@ts-ignore
import { FieldSubmission, Task, Field, SelectedOption, Option, Student, TaskOfStudent, sequelize } from "../../models";
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
import field from "../../models/field";
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
        as:'field',
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
        as:'field',
        attributes: ["formId"],
        // attributes: [],
      },
    ],
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
        as:'field',
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
        as:'field',
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
        as:'field',
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

const validateForm:RequestHandler = async function (req,res,next){
  try{

    const {id,submissions} =  req.body
    //@ts-ignore
    const {user} =  req
    const formIsValid = await Task.findOne({where:{
      externalId:id,
      status:'active',
      type:'quizMe',
      endDate:{
        [Op.gte]:new Date()
      }
    }})
    if(!formIsValid){
      throw 'form is past due date!'
    }
    req.body = submissions
    next()
  }catch(err){
    console.trace(err)
    return res.send('a') 
  }
}

router.use(validateForm)
  
router.post('/form', async (req: Request, res: Response) => {

  async function updateOrCreateField(studentId:number,fieldId:number, answer:string|IOption[]){
    try {
      let createdNew = false
      const textualAnswer =  typeof answer === 'string'
        ? answer
        :null
      let sub = await FieldSubmission.findOne({
        where:{studentId,fieldId},
        attributes:['id'],
      })
      if(!sub){
        const creation = await FieldSubmission.create({
          studentId,
          fieldId,
          textualAnswer
        })
        sub = await FieldSubmission.findOne({
          where:{
            [Op.and]:{
              studentId,
              fieldId,
              textualAnswer,
              createdAt:creation.createdAt
            }
          },attributes:['id']
        })
        createdNew = true
      }else{
        await FieldSubmission.update({textualAnswer},{where:{
          id:sub.id
        }})
      }
      
      const {id:fieldSubmissionId} = sub
      return {fieldSubmissionId,createdNew}
    } catch(err) {
      throw err
    }
      
  }
  async function insertOptionsField(createdNew:boolean,submissionId:number,answer:IOption[]){
    console.log(answer)
    try{
      
      const qi :QueryInterface = db.sequelize.getQueryInterface()
      // const added = await qi.bulkInsert('SelectedOptions',
      //   answer.map(({id})=>({
      //     option_id:id,field_submission_id:submissionId
      //   })))
      //   console.log(added)
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
    console.log('body: ', body);

    const formId = (await Field.findOne({
      where: {
        id: body[0].fieldId
      }
    })).formId;
    const taskId = (await Task.findOne({
      where: {
        externalId: formId
      }
    })).id;
    // find task where externalId === formId

    const taskOfStudent = await TaskOfStudent.update({status: "done"}, {
      where: {
        studentId: body[0].studentId,
        taskId: taskId
      }
    })

    const submissions = await Promise.all(body.map( async ({studentId,fieldId,answer})=>{
      const {createdNew,fieldSubmissionId} = await updateOrCreateField(studentId,fieldId, answer)
      const qi :QueryInterface = db.sequelize.getQueryInterface()
      await qi.bulkDelete(SelectedOption.tableName,{field_submission_id:fieldSubmissionId})
      if(typeof answer !== 'string'){
        console.log(answer)
        console.log(fieldSubmissionId)
        await qi.bulkInsert(SelectedOption.tableName,
          answer.map(({id:optionId})=>({
            option_id:optionId,
            field_submission_id:fieldSubmissionId
          }))
        )
      }
    }))
    res.status(201).send('success')
    
  }
  catch(error) {
    console.trace(error)
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
