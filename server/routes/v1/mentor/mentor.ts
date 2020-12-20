import { Request, Response, Router } from 'express';
//@ts-ignore
<<<<<<< HEAD
import { Student,Mentor,Meeting,Class,MentorProgram,MentorStudent, } from '../../../models';
=======
import { Mentor, Student, Meeting,Class } from '../../../models';
>>>>>>> 660706bdb5dd7d40b47883afb379e03ee50f67bf
import { mentorSchema, mentorSchemaToPut } from '../../../validations';
import { IMentor } from '../../../types';

const router = Router();

<<<<<<< HEAD
router.get('/available', async (req: Request, res: Response) => {
  try {
    const allMentors: any[] = await Mentor.findAll({
      where: {
        available: true
      },
      include: [{
        model: MentorStudent,
      }]
    });
    res.json(allMentors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

=======
>>>>>>> 660706bdb5dd7d40b47883afb379e03ee50f67bf
// Get all mentors
router.get('/', async (req: Request, res: Response) => {
  try {
    const allMentors: any[] = await Mentor.findAll({});

    res.json(allMentors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

<<<<<<< HEAD

=======
>>>>>>> 660706bdb5dd7d40b47883afb379e03ee50f67bf
// Get all information about specific mentor
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const mentor: any[] = await Mentor.findAll({
      where: { id: req.params.id },
      include: [
        {
<<<<<<< HEAD
          model: MentorStudent,
          include: [
            {
              model:MentorProgram,
              attributes: ["name"]
            },
            {
              model:Student,
              attributes: ["firstName", "lastName"]
            }
          ]
        },
=======
          model: Student,
          include: [
            {
              model:Class,
              attributes: ["name","cycleNumber"]
            }
          ]
        },
        {
          model: Meeting,
        },
>>>>>>> 660706bdb5dd7d40b47883afb379e03ee50f67bf
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
