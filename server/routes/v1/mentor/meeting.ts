import { Request, Response , Router } from "express";
import {meetingSchema, meetingSchemaToPut} from "../../../validations"
//@ts-ignore
import { Student, Mentor, MentorStudent, Meeting, Class} from "../../../models";
import { IDashboard, IMeeting } from "../../../types";

const router = Router();

// get pair meets:
router.get('/:id', async (req: Request, res: Response) => {
    try{
        const classTableData:IDashboard[] = await MentorStudent.findOne({
            where:{id:req.params.id},
            include:[
                {
                    model: Student,
                },
                {
                    model: Mentor,
                },
                {
                    model: Meeting,
                }
            ]
        });
        res.json(classTableData);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

// post new meet:
router.post('/', async (req: Request, res: Response) => {
    try{
        const {error} = meetingSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.message });
        const newMeeting:IMeeting = await Meeting.create(req.body);
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
        where: { id : meetingtId },
      });
      if (deleted) return res.json({ message: "Meeting deleted" });
      return res.status(404).json({ error: "Meeting not found" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


module.exports = router;