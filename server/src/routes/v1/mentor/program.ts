import { Request, Response, Router } from "express";
import {
  mentorProgramSchema,
  mentorProgramSchemaToPut,
} from "../../../validations";
//@ts-ignore
import { MentorStudent, MentorProgram, Class } from "../../../models";
//@ts-ignore
import { Student, Mentor, Meeting, MentorForm } from "../../../models";
import { IMentorProgram, IDashboard } from "../../../types";
import { sendMail } from "../../../mail";

const mailProps = (to: string, subject: string, text: string) => ({
  from: "lea.soshnik@suvelocity.org", //sender || process.env.EMAIL_USER,
  to,
  subject,
  text,
});

const router = Router();

// get all the mentor programs:
router.get("/all", async (req: Request, res: Response) => {
  try {
    const allProgram: IMentorProgram[] = await MentorProgram.findAll({
      order: [["open", "DESC"]],
    });
    res.json(allProgram);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});
// get program by id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const program: IMentorProgram[] = await MentorProgram.findByPk(
      req.params.id
    );
    res.json(program);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get all program meetings:
router.get("/dashboard/:id", async (req: Request, res: Response) => {
  try {
    const program = await MentorProgram.findByPk(req.params.id);
    const programTableData = await Student.findAll({
      attributes: ["id", "firstName", "lastName"],
      where: { classId: program.classId },
      include: [
        {
          model: MentorStudent,
          where: {
            mentorProgramId: req.params.id,
          },
          required: false,
          include: [
            {
              model: Mentor,
            },
            {
              model: Meeting,
            },
          ],
        },
      ],
    });
    res.json(programTableData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get all program forms:
router.get("/forms/:id", async (req: Request, res: Response) => {
  try {
    const programForms = await MentorProgram.findOne({
      where: { id: req.params.id },
      attributes: ["id"],
      include: [
        {
          model: MentorForm,
        },
      ],
    });
    res.json(programForms);
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
    const programUpdated = await MentorProgram.update(
      { open: false },
      {
        where: { id: req.params.id },
      }
    );
    return res.json({ message: "mentor project ended" });
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

router.post("/startmails/:id", async (req, res) => {
  try {
    const pairs = await MentorStudent.findAll({
      where: {
        mentorProgramId: parseInt(req.params.id),
      },
      include: [
        {
          model: Mentor,
        },
        {
          model: Student,
        },
        {
          model: MentorProgram,
          attributes: ["name"],
        },
      ],
    });

    await pairs.forEach(async (pair: any) => {
      await sendMail(
        mailProps(
          pair.Student.email,
          pair.MentorProgram.name,
          `
          Welcome to ${pair.MentorProgram.name} - Mentoring Program
          
                   In the next few weeks you you will have a Mentor- a person to consult with and to learn from, in order to raise your chances in finding your next job.
          
                   We hope you will grow from this experience and fulfill this wonderful opportunity.
          
                   Please do not forget to help us keep track of your meetings and feedbacks via http://35.226.223.57:8080/mentor/meeting/48
          
                   Your mentor is: \n
                   -  ${pair.Mentor.name} \n
                   -  contact: ${pair.Mentor.email} / ${pair.Mentor.phone} \n
                   -  company: ${pair.Mentor.company} \n
                   -  role: ${pair.Mentor.role}
          
           
          
          Please contact your mentor and schedule your first meeting.
          
           
          
          For more questions please contact: Lea.soshnik@suvelocity.org
          
           
          `
        ),
        (error: any) => res.status(500).json({ error: error.message })
      );

      await sendMail(
        mailProps(
          pair.Mentor.email,
          pair.MentorProgram.name,
          `Welcome to ${pair.MentorProgram.name} \n \n  
         Thank you so much for volunteering to take part in our project \n 
         Your student: \n 
          -  ${pair.Student.firstName + " " + pair.Student.lastName}\n
          -  contact: ${pair.Student.email} / ${pair.Student.phone} \n
      `
        ),
        (error: any) => res.status(500).json({ error: error.message })
      );
    });
    await MentorProgram.update(
      { email: true },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.json(pairs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/mails/:id", async (req, res) => {
  try {
    const pairs = await MentorStudent.findAll({
      where: {
        mentorProgramId: parseInt(req.params.id),
      },
      include: [
        {
          model: Mentor,
        },
        {
          model: Student,
        },
      ],
    });
    await pairs.forEach((pair: any) => {
      if (req.query.recievers !== "mentors") {
        sendMail(
          mailProps(pair.Student.email, req.body.subject, req.body.content)
        );
      }
      if (req.query.recievers !== "students") {
        sendMail(
          mailProps(pair.Mentor.email, req.body.subject, req.body.content)
        );
      }
    });
    res.json(pairs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Edit mentor forms sent attribute
router.put("/editForm/:id", async (req, res) => {
  try {
    const programForms = await MentorForm.update(
      { sent: true },
      {
        where: { id: req.params.id },
      }
    );
    res.json("sent!");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
