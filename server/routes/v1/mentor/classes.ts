import { Request, Response, Router } from "express";
//@ts-ignore
<<<<<<< HEAD
import { MentorStudent, Class, Student, Mentor} from "../../../models";
import {mentorStudentSchemaToPut, mentorStudentSchema} from "../../../validations";
import { IClass } from "../../../types";

const router = Router();

// get all classes
router.get("/", async (req: Request, res: Response) => {
  try {
    const classes: IClass[] = await Class.findAll();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  
// add mentorstudent relation: 
router.post("/", async (req: Request, res: Response) => {
    try {
        const { error } = mentorStudentSchema.validate(req.body);       
        if (error) return res.status(400).json(error);
        const newRelation = await MentorStudent.create(req.body);        
        return res.json(newRelation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
// update mentorstudent relation
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { error } = mentorStudentSchemaToPut.validate(req.body);
    if (error) return res.status(400).json(error);
    const updated = await MentorStudent.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated[0] === 1) return res.json({ message: "Relation updated" });
    res.status(404).json({ error: "Relation not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const deleted = await MentorStudent.destroy({
      where: {
        id: id
      }
    })
    console.log(deleted)
    if (deleted) return res.json({ message: "Relation deleted" });
    res.status(404).json({ error: "Relation not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/byId/:class/:program", async (req: Request, res: Response) => {
  try {
    const selectedClass: IClass[] = await Class.findByPk(req.params.class, {
      include: [
        {
          model: Student,
          required: false,
          include: [
            {
              model: MentorStudent,
              required: false,
              where: {mentorProgramId: parseInt(req.params.program)},
              include: [
                {
                  model: Mentor,
                  attributes: ['name', 'id', 'address', 'company', 'job']
                }
              ]
            }
          ]
        },
      ],
    });
    if (selectedClass) return res.json(selectedClass);
    res.status(404).json({ error: "Class not found" });
=======
import { Student, Class, Mentor } from "../../../models";
import {studentMentorIdPut} from "../../../validations"
import { IMentor } from "../../../types";
import sequelize from "sequelize"
import { Console } from "console";

const router = Router();

// get all the classes with mentor project:
router.get("/with", async (req: Request, res: Response) => {
    try {
      const classes: IMentor[] = await Class.findAll({
        where: { mentorProject: true },
        include: {
          model: Student,
          attributes: ['mentorId']
        }
      });
      res.json(classes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// get all the classes without mentor project: 
router.get("/without", async (req: Request, res: Response) => {
    try {
      const classes: IMentor[] = await Class.findAll({
          where:{mentorProject:{ [sequelize.Op.not]: true}}
      });
      res.json(classes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// add mentor project to class: 
router.put("/:id", async (req: Request, res: Response) => {
    try {
        const updated = await Class.update({mentorProject: true}, {
            where: { id: req.params.id },
        });
  if (updated[0] === 1) return res.json({ message: "mentor project started" });
  res.status(404).json({ error: "class not found" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
router.put("/end/:id", async (req: Request, res: Response) => {
  try {
    const students : number = parseInt(req.body.students)
      const classUpdated = await Class.update({mentorProject: false}, {
          where: { id: req.params.id },
      });
    const studentUpdated = await Student.update({ mentorId: null }, {
      where: {
        classId: req.params.id
      }
    });
    console.log
    (students)
    if (classUpdated[0] === 1 && studentUpdated[0] === students) return res.json({ message: "mentor project ended" })
    res.status(404).json({ error: "class not found" });
>>>>>>> 660706bdb5dd7d40b47883afb379e03ee50f67bf
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  
<<<<<<< HEAD
=======
// add mentor to student: 
router.put("/student/:id", async (req: Request, res: Response) => {
    try {
        const { error } = studentMentorIdPut.validate(req.body);       
        if (error) return res.status(400).json(error);
        const {mentorId} = req.body
        const updated = await Student.update({mentorId:mentorId}, {
            where: { id: req.params.id },
        });        
  if (updated[0] === 1) return res.json({ message: "added mentor to the student" });
  res.status(404).json({ error: "student not found" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

  
>>>>>>> 660706bdb5dd7d40b47883afb379e03ee50f67bf

module.exports = router;