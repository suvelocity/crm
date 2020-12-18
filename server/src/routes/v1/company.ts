import { Router, Request, Response } from "express";
const router = Router();
//@ts-ignore
import { Company, Job } from "../../models";
import { ICompany, IJob } from "../../types";
import { companySchema, companySchemaToPut } from "../../validations";

router.get("/all", async (req: Request, res: Response) => {
  try {
    const companies: ICompany[] = await Company.findAll({
      include: [
        {
          model: Job,
        },
      ],
    });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/byId/:id", async (req: Request, res: Response) => {
  try {
    const selectedCompany: ICompany[] = await Company.findByPk(req.params.id, {
      include: [
        {
          model: Job,
        },
      ],
    });
    if (selectedCompany) return res.json(selectedCompany);
    res.status(404).json({ error: "Company not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const body: ICompany = req.body;
    const newCompany: ICompany = {
      name: body.name,
      location: body.location,
      description: body?.description,
      contactName: body?.contactName,
      contactNumber: body?.contactNumber,
      contactPosition: body?.contactPosition,
    };
    const { error } = companySchema.validate(newCompany);
    if (error) return res.status(400).json({ error: error.message });
    const createdCompany: ICompany = await Company.create(newCompany);
    res.json(createdCompany);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { value, error } = companySchemaToPut.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const updated = await Company.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated[0] === 1) return res.json({ message: "Company updated" });
    res.status(404).json({ error: "Company not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Company.destroy({
      where: { id },
    });
    if (deleted === 0) {
      return res.status(404).send("Company not found");
    } else {
      await Job.destroy({ where: { companyId: id } });
      res.json({ message: "Company deleted" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
