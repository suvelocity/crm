import { Request, Response, Router } from "express";
//@ts-ignore
import { Student, Mentor, Meeting } from "../../../models";
//@ts-ignore
import { Class, MentorProgram, MentorStudent } from "../../../models";
import { mentorSchema, mentorSchemaToPut } from "../../../validations";
import { IMentor } from "../../../types";
import { Op } from "sequelize";

const router = Router();

router.get("/available", async (req: Request, res: Response) => {
  try {
    const allMentors: any[] = await Mentor.findAll({
      where: {
        available: true,
      },
      include: [
        {
          model: MentorStudent,
        },
      ],
    });
    res.json(allMentors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all mentors
router.get("/", async (req: Request, res: Response) => {
  try {
    const { classId, notClassIds } = req.query;
    let mentorWhere: any = {};
    if (classId) {
      mentorWhere.agreedTo = {
        [Op.like]: "%" + classId + "%",
      };
    } else if (notClassIds) {
      mentorWhere[`[Op.not]`] = {
        agreedTo: {
          [Op.or]: {
            [Op.like]: "%" + notClassIds + "%",
          },
        },
      };
    }
    const allMentors: any[] = await Mentor.findAll({
      where: mentorWhere,
      // order:[["available","DESC"]],
      include: [
        {
          model: MentorStudent,
        },
      ],
    });

    res.json(allMentors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all information about specific mentor
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const mentor: any[] = await Mentor.findAll({
      where: { id: req.params.id },
      include: [
        {
          model: MentorStudent,
          include: [
            {
              model: MentorProgram,
              attributes: ["name"],
            },
            {
              model: Student,
              attributes: ["firstName", "lastName"],
            },
          ],
        },
      ],
    });

    res.json(mentor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post new mentor
router.post("/", async (req: Request, res: Response) => {
  try {
    const { error } = mentorSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const newMentor: IMentor = await Mentor.create(req.body);
    res.json(newMentor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit exist mentor
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { error } = mentorSchemaToPut.validate(req.body);
    console.log(error);
    if (error) return res.status(400).json({ error: error.message });
    const updated = await Mentor.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated[0] === 1) return res.json({ message: "Mentor updated" });
    res.status(404).json({ error: "Mentor not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// delete mentor
router.patch("/delete", async (req, res) => {
  try {
    const { mentorId } = req.body;
    const deleted: any = await Mentor.destroy({
      where: { id: mentorId },
    });
    if (deleted) return res.json({ message: "Mentor deleted" });
    return res.status(404).json({ error: "Mentor not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
