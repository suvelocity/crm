import { Router, Response, Request } from "express";
//@ts-ignore
import { Student, Job, Event, Class } from "../../models";
import { IStudent } from "../../types";
import { studentSchema, studentSchemaToPut } from "../../validations";
const router = Router();

router.get("/all", async (req: Request, res: Response) => {
  try {
    const students: IStudent[] = await Student.findAll({
      include: [
        {
          model: Event,
          include: [
            {
              model: Job,
            },
          ],
          attributes: ["status", "date", "comment"],
        },
        {
          model: Class,
        },
      ],
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/byId/:id", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const student: IStudent | null = await Student.findByPk(id, {
      include: [
        {
          model: Event,
          include: [
            {
              model: Job,
            },
          ],
          attributes: ["status", "date", "comment"],
        },
        {
          model: Class,
        },
      ],
    });
    if (student) {
      return res.json(student);
    } else {
      return res.status(404).send("student does not exist");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const body: IStudent = req.body;
    const studentExists = await Student.findOne({
      where: { idNumber: body.idNumber },
    });
    if (studentExists) return res.status(400).send("Student already exists");
    const newStudent: IStudent = {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      idNumber: body.idNumber,
      additionalDetails: body.additionalDetails,
      classId: body.classId,
      address: body.address,
      age: body.age,
      maritalStatus: body.maritalStatus,
      children: body.children,
      academicBackground: body.academicBackground,
      militaryService: body.militaryService,
      workExperience: body.workExperience,
      languages: body.languages,
      citizenship: body.citizenship,
    };
    const { value, error } = studentSchema.validate(newStudent);
    if (error) return res.status(400).json(error);
    const student: IStudent = await Student.create(newStudent);
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const { error } = studentSchemaToPut.validate(req.body);
  if (error) return res.status(400).json(error);
  try {
    const updated = await Student.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated[0] === 1) return res.json({ message: "Student updated" });
    res.status(404).json({ error: "Student not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Student.destroy({
      where: { id },
    });
    if (deleted === 0)
      return res.status(404).json({ message: "Student not found" });
    await Event.destroy({ where: { studentId: id } });
    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
