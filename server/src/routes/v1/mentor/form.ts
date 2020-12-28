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
  
  // delete form
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

  //send to students:
  
  
 

module.exports = router;