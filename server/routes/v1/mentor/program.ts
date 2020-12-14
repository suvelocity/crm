import { Request, Response, Router } from "express";
import {
  meetingSchema,
  meetingSchemaToPut,
  mentorProgramSchema,
  mentorProgramSchemaToPut,
} from "../../../validations";
//@ts-ignore
import {Student,Mentor,Meeting,Class,MentorProgram, MentorStudent} from "../../../models";
import { IMentorProgram, IDashboard } from "../../../types";

const router = Router();

// get all the mentor programs:
router.get("/all", async (req: Request, res: Response) => {
  try {
    const allProgram: IMentorProgram[] = await MentorProgram.findAll();
    res.json(allProgram);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// det program by id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const program: IMentorProgram[] = await MentorProgram.findByPk(req.params.id);
    res.json(program);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get all program meetings:
router.get("/dashboard/:id", async (req: Request, res: Response) => {
  try {
    const programTableData = await MentorStudent.findAll({
      where: { mentorProgramId: req.params.id },
      include: [
        {
          model: Student,
        },
        {
          model: Mentor,
        },
        {
          model: Meeting,
        },
      ],
    });
    res.json(programTableData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// post new program:
router.post("/", async (req: Request, res: Response) => {
  try {
    const { error } = mentorProgramSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const newProgram: IMentorProgram = await MentorProgram.create(req.body);
    res.json(newProgram);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// update program
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { error } = mentorProgramSchemaToPut.validate(req.body);
    if (error) return res.status(400).json(error);
    const updated = await MentorProgram.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated[0] === 1) return res.json({ message: "Program updated" });
    res.status(404).json({ error: "Program not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// end program and remove mentor id from students 
router.put("/end/:id", async (req: Request, res: Response) => {
    try {
        const program: IMentorProgram = await MentorProgram.findByPk(req.params.id);
        const students : number = parseInt(req.body.students)
        const programUpdated = await MentorProgram.update({open: false}, {
            where: { id: req.params.id },
        });
      const studentUpdated = await Student.update({ mentorId: null }, {
        where: {
          classId:program.classId
        }
      });
      console.log
      (students)
      if (programUpdated[0] === 1 && studentUpdated[0] === students) return res.json({ message: "mentor project ended" })
      res.status(404).json({ error: "class not found" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// delete program
router.patch("/delete", async (req, res) => {
  try {
    const { programId } = req.body;
    const deleted: any = await MentorProgram.destroy({
      where: { id: programId },
    });
    if (deleted) return res.json({ message: "Program deleted" });
    return res.status(404).json({ error: "Program not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
