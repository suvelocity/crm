import { Request, Response, Router } from "express";
//@ts-ignore
import { MentorForm } from "../../../models";
import {mentorFormSchema, mentorFormSchemaToPut} from "../../../validations";
import { IMentorForm } from "../../../types";

const router = Router();
// post new form:
router.post("/", async (req: Request, res: Response) => {
    try {
      const { error } = mentorFormSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.message });
      const newForm: IMentorForm = await MentorForm.create(req.body);
      res.json(newForm);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
//   // update program
//   router.put("/:id", async (req: Request, res: Response) => {
//     try {
//       const { error } = mentorProgramSchemaToPut.validate(req.body);
//       if (error) return res.status(400).json(error);
//       const updated = await MentorProgram.update(req.body, {
//         where: { id: req.params.id },
//       });
//       if (updated[0] === 1) return res.json({ message: "Program updated" });
//       res.status(404).json({ error: "Program not found" });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });
  
//   // end program and remove mentor id from students
//   router.put("/end/:id", async (req: Request, res: Response) => {
//     try {
//       const programUpdated = await MentorProgram.update(
//         { open: false },
//         {
//           where: { id: req.params.id },
//         }
//       );
//       return res.json({ message: "mentor project ended" });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });
  
  // delete program
  router.patch("/delete", async (req, res) => {
    try {
      const { formId } = req.body;
      const deleted: any = await MentorForm.destroy({
        where: { id: formId },
      });
      if (deleted) return res.json({ message: "form deleted" });
      return res.status(404).json({ error: "form not found" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
 

module.exports = router;