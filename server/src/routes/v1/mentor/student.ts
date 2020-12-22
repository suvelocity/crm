import { Request, Response, Router } from "express";
//@ts-ignore
import { MentorStudent,MentorProgram, Class, Student, Mentor} from "../../../models";
import {mentorStudentSchemaToPut, mentorStudentSchema} from "../../../validations";
import { IClass } from "../../../types";

const router = Router();

// get all classes
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const classes: IClass[] = await Student.findOne({
        where: { id: req.params.id },
        include:[
            {
                model:MentorStudent,
                include: [
                    {
                        model:MentorProgram,
                        where:{open:true},
                    }
                ]
            },
        ]
    });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 

module.exports = router;