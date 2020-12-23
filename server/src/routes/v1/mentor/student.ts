import { Request, Response, Router } from "express";
//@ts-ignore
import { MentorStudent,MentorProgram, Class, Student, Mentor} from "../../../models";
import {mentorStudentSchemaToPut, mentorStudentSchema} from "../../../validations";
import { IClass } from "../../../types";

const router = Router();

// get the student
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const student: IClass[] = await Student.findOne({
        where: { id: req.params.id },
        // required:false,
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
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 

module.exports = router;