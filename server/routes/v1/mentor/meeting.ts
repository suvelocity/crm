import { Request, Response , Router } from "express";
//@ts-ignore
import { Student, Job, Event, Class, Mentor, Meeting } from "../../../models";
import { IMentor } from "../../../types";

const router = Router();

// get class deshbord table:
router.get('/class/:id', async (req: Request, res: Response) => {
    try{
        const classTableData:any[] = await Student.findAll({
            attributes:["id", "firstName", "lastName"],
            where:{classId:req.params.id},
            include:[
                {
                    model: Mentor,
                },
                {
                    model: Meeting,
                    attributes:["mentorId", "date"],
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
        const studentMeets:any[] = await Student.findOne({
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


module.exports = router;