import { Request, Response, Router } from 'express';
//@ts-ignore
import { Mentor, Student, Meeting } from '../../../models';
import { mentorSchema, mentorSchemaToPut } from '../../../validations';
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

// Post new mentor
router.post('/', async (req: Request, res: Response) => {
  try {
    const { error } = mentorSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const {
      name,
      company,
      email,
      phone,
      address,
      job,
      available,
      gender,
    } = req.body;
    const newMentor: IMentor = await Mentor.create({
      name,
      company,
      email,
      phone,
      address,
      job,
      available,
      gender,
    });
    res.json(newMentor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit exist mentor
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { error } = mentorSchemaToPut.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const updated = await Mentor.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated[0] === 1) return res.json({ message: 'Mentor updated' });
    res.status(404).json({ error: 'Mentor not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// delete meeting
router.patch('/delete', async (req, res) => {
  try {
    const { mentorId } = req.body;
    const deleted: any = await Mentor.destroy({
      where: { id: mentorId },
    });
    if (deleted) return res.json({ message: 'Mentor deleted' });
    return res.status(404).json({ error: 'Mentor not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
