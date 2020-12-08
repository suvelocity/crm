import { Request, Response , Router } from "express";
import {meetingSchema, meetingSchemaToPut} from "../../../validations"
//@ts-ignore
import { Student, Mentor, Meeting } from "../../../models";
import { IDeshbord } from "../../../types";

const router = Router();

// get class deshbord table:
router.get('/class/:id', async (req: Request, res: Response) => {
    try{
        const classTableData:IDeshbord[] = await Student.findAll({
            attributes:["id", "firstName", "lastName"],
            where:{classId:req.params.id},
            include:[
                {
                    model: Mentor,
                },
                {
                    model: Meeting,
                    attributes:["date"],
                }
            ]
        });

        res.json(classTableData);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

// get student meets:
router.get('/student/:id', async (req: Request, res: Response) => {
    try{
        const studentMeets:IDeshbord = await Student.findOne({
            attributes:["id", "firstName", "lastName"],
            where:{id:req.params.id},
            include:[
                {
                    model: Mentor
                },
                {
                    model: Meeting,
                    attributes:["date"],
                },
            ]
        });

        res.json(studentMeets);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

// post new meet:
router.post('/', async (req: Request, res: Response) => {
    const {error} = meetingSchema.validate(req.body);
    try{
        const {studentId, date, place} = req.body;
        const { mentorId } = await Student.findOne({
            where: {id:studentId},
            attributes: ["mentorId"]
        }) 
        const meeting = {
            mentorId,
            studentId,
            date: new Date(date),
            place,
            created_at: new Date(),
            updated_at: new Date()
        }
        const newMeeting:any = await Meeting.create(meeting);
        res.json(newMeeting);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

// update meeting

// delete meeting


module.exports = router;