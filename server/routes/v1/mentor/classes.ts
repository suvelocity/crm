import { Request, Response, Router } from "express";
//@ts-ignore
import { MentorStudent} from "../../../models";
import {mentorStudentSchemaToPut, mentorStudentSchema} from "../../../validations"

const router = Router();
  
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
  

module.exports = router;