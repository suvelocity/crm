import { Router, Response, Request } from "express";
import Student, { IStudent } from "../../models/student.model";

const router = Router();
router.get("/all", async (req: Request, res: Response) => {
  try {
    const students: IStudent[] = await Student.find({}).exec();
    res.json(students);
  } catch (err) {
    res.send(err.message);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student: IStudent | null = await Student.findByIdAndRemove(id);
    if (student) {
      return res.json(student);
    } else {
      return res.send("student not exist");
    }
  } catch (err) {
    res.send("student not exist");
  }
});

router.get("/byId/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student: IStudent | null = await Student.findById(id);
    if (student) {
      return res.json(student);
    } else {
      return res.send("student not exist");
    }
  } catch (err) {
    res.send("error occurred");
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student: IStudent | null = await Student.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).exec();
    if (student) {
      return res.json(student);
    } else {
      return res.send("student not exist");
    }
  } catch (err) {
    res.send("error occurred");
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const body: Partial<IStudent> = req.body;
    const newStudent: IStudent = new Student({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      idNumber: body.idNumber,
      description: body.description,
      class: body.class,
      address: body.address,
    });
    const student: IStudent = await newStudent.save();
    res.json(student);
  } catch (err) {
    res.send("error occurred");
  }
});

module.exports = router;
