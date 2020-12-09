import { Request, Response, Router } from 'express';
//@ts-ignore
import { Mentor, Student, Meeting } from '../../../models';
import { mentorSchema } from '../../../validations';
import { IMentor } from '../../../types';

const router = Router();

// Get all mentors
router.get('/', async (req: Request, res: Response) => {
  try {
    const allMentors: any[] = await Mentor.findAll({});

    res.json(allMentors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all information about specific mentor
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const mentor: any[] = await Mentor.findAll({
      where: { id: req.params.id },
      include: [
        {
          model: Student,
        },
        {
          model: Meeting,
        },
      ],
    });

    res.json(mentor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// post new mentor:
router.post('/', async (req: Request, res: Response) => {
  try {
    const { error } = mentorSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const { name, company, email, phone, address, job } = req.body;
    const newMentor: IMentor = await Mentor.create({
      name,
      company,
      email,
      phone,
      address,
      job,
    });
    res.json(newMentor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
