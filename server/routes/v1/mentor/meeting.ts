import { Request, Response , Router } from "express";
import {meetingSchema, meetingSchemaToPut} from "../../../validations"
//@ts-ignore
import { Student, Mentor, Meeting, Class} from "../../../models";
<<<<<<< HEAD
import { IDashboard, IMeeting } from "../../../types";
=======
import { IDeshbord, IMeeting } from "../../../types";
>>>>>>> 660706bdb5dd7d40b47883afb379e03ee50f67bf

const router = Router();

// get class deshbord table:
router.get('/class/:id', async (req: Request, res: Response) => {
    try{
<<<<<<< HEAD
        const classTableData:IDashboard[] = await Student.findAll({
=======
        const classTableData:IDeshbord[] = await Student.findAll({
>>>>>>> 660706bdb5dd7d40b47883afb379e03ee50f67bf
            attributes:["id", "firstName", "lastName"],
            where:{classId:req.params.id},
            include:[
                {
                    model: Class,
                    attributes: ["name", "cycleNumber"]
                },
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
<<<<<<< HEAD
        const studentMeets:IDashboard = await Student.findOne({
=======
        const studentMeets:IDeshbord = await Student.findOne({
>>>>>>> 660706bdb5dd7d40b47883afb379e03ee50f67bf
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
    try{
        const {error} = meetingSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.message });
        const {studentId, date, place} = req.body;
        const { mentorId } = await Student.findOne({
            where: {id:studentId},
            attributes: ["mentorId"]
        }) 
        const newMeeting:IMeeting = await Meeting.create({
            mentorId,
            studentId,
            date: new Date(date),
            place
        });
        res.json(newMeeting);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

// update meeting
router.put('/:id', async (req: Request, res: Response) => {
    try{
        const { error } = meetingSchemaToPut.validate(req.body);
        if (error) return res.status(400).json(error);
        const updated = await Meeting.update(req.body, {
            where: { id: req.params.id },
        });
  if (updated[0] === 1) return res.json({ message: "Meeting updated" });
  res.status(404).json({ error: "Meeting not found" });

    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

// delete meeting
router.patch("/delete", async (req, res) => {
    try {
      const {meetingtId} = req.body;
      const deleted: any = await Meeting.destroy({
        where: { id:meetingtId },
      });
      if (deleted) return res.json({ message: "Meeting deleted" });
      return res.status(404).json({ error: "Meeting not found" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


module.exports = router;