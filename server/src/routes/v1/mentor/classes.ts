import { Request, Response, Router } from "express";
//@ts-ignore
import { MentorStudent, Class, Student, Mentor} from "../../../models";
import {mentorStudentSchemaToPut, mentorStudentSchema} from "../../../validations";
import { IClass } from "../../../types";
const { Op } = require("sequelize");

const router = Router();

// get all classes
router.get("/", async (req: Request, res: Response) => {
  try {
    const classes: IClass[] = await Class.findAll({
      where:{
        endingDate:{
          [Op.gt]: new Date(),
        }
      }
    });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  
// add mentorstudent relation: 
router.post("/", async (req: Request, res: Response) => {
    try {
        const { error } = mentorStudentSchema.validate(req.body);       
        if (error) return res.status(400).json(error);
        const newRelation = await MentorStudent.create(req.body);        
        return res.json(newRelation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
// update mentorstudent relation
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { error } = mentorStudentSchemaToPut.validate(req.body);
    if (error) return res.status(400).json(error);
    const updated = await MentorStudent.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated[0] === 1) return res.json({ message: "Relation updated" });
    res.status(404).json({ error: "Relation not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const deleted = await MentorStudent.destroy({
      where: {
        id: id
      }
    })
    console.log(deleted)
    if (deleted) return res.json({ message: "Relation deleted" });
    res.status(404).json({ error: "Relation not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/byId/:class/:program", async (req: Request, res: Response) => {
  try {
    const selectedClass: IClass[] = await Class.findByPk(req.params.class, {
      include: [
        {
          model: Student,
          required: false,
          include: [
            {
              model: MentorStudent,
              required: false,
              where: {mentorProgramId: parseInt(req.params.program)},
              include: [
                {
                  model: Mentor,
                  attributes: ['name', 'id', 'address', 'company', 'role', 'experience']
                }
              ]
            }
          ]
        },
      ],
    });
    if (selectedClass) return res.json(selectedClass);
    res.status(404).json({ error: "Class not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  

module.exports = router;