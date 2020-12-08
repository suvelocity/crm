import { Request, Response , Router } from "express";
import { Sequelize } from "sequelize/types";
//@ts-ignore
import { Student, Job, Event, Class, Mentor, Meeting } from "../../../models";
import { IMentor } from "../../../types";
import { meetingSchemaToPut } from "../../../validations";
const { Op } = require('Sequelize')
const oneDay = 1000 * 60 * 60 * 24

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
    try {
        const studentMeets: any[] = await Student.findOne({
            attributes: ["id", "firstName", "lastName"],
            where: { id: req.params.id },
            include: [
                {
                    model: Mentor
                },
                {
                    model: Meeting,
                    attributes: ["date"],
                },
            ]
        });

        res.json(studentMeets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/byday/:day/:offset', async (req: Request, res: Response) => {
    try {
        const startDate: Date = new Date(req.params.day)
        const daysGap: number = parseInt(req.params.offset)
        const endDate: Date = new Date(startDate.getTime() + (oneDay * daysGap))
        const meetings: any[] = await Meeting.findAll({
            where: {
                date: {
                    [Op.lt]: endDate,
                    [Op.gt]: startDate
                  }
            },
            include: [
                {
                    model: Student,
                    attributes: ["first_name", "last_name", "email"],
                },
                {
                    model: Mentor,
                    attributes: ["name", "email"],
                }
            ]
                
        });
        res.json(meetings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", async (req: Request, res: Response) => {
    const { error } = meetingSchemaToPut.validate(req.body);
    if (error) return res.status(400).json(error);
    try {

        const updated = await Meeting.update({
            place: req.body.place,
            date: new Date(req.body.date)
      }, {
        where: { id: req.params.id },
      });
      if (updated[0] === 1) return res.json({ message: "Meeting updated" });
      res.status(404).json({ error: "Meeting not found" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
router.get("/all", async (req: Request, res: Response) => {
    try {
      const meetings: any[] = await Meeting.findAll();
      res.json(meetings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});


// post new meet:


module.exports = router;