import { Router, Response, Request } from "express";
import { isNumber } from "lodash";
import { cancelAllApplicantsForJob } from "../../helper";
//@ts-ignore
import { Student, Job, Event, Class, Company } from "../../models";
import job from "../../models/job";
import { IJob } from "../../types";
import { jobSchema, jobSchemaToPut } from "../../validations";
const router = Router();

router.get("/all", async (req: Request, res: Response) => {
  try {
    const jobs: IJob[] = await Job.findAll({
      include: [
        {
          model: Event,
          include: [
            {
              model: Student,
              include: [
                {
                  model: Class,
                },
              ],
            },
          ],
        },
        {
          model: Company,
        },
      ],
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/byId/:id", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const only = req.query.only;
    const job: IJob | null = await Job.findByPk(id, {
      include: [
        {
          model: Event,
          where: only ? { type: only } : {},
          required: false,
          include: [
            {
              model: Student,
              include: [
                {
                  model: Class,
                },
              ],
            },
          ],
        },
        {
          model: Company,
        },
      ],
    });
    if (job) {
      return res.json(job);
    } else {
      return res.status(404).json({ error: "Job does not exist" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      position,
      companyId,
      description,
      location,
      requirements,
      additionalDetails,
    } = req.body;
    const newJob: Partial<IJob> = {
      position,
      companyId,
      description,
      location,
      requirements,
      additionalDetails,
    };
    const { error } = jobSchema.validate(newJob);
    if (error) return res.status(400).json({ error: error.message });
    const job: IJob = await Job.create(newJob);
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  const { error } = jobSchemaToPut.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  try {
    const updated = await Job.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated[0] === 1) return res.json({ message: "Job updated" });
    res.status(404).json({ error: "Job not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:action/:id", async (req: Request, res: Response) => {
  const {
    params: { action, id },
    body: { closeComment },
  } = req;

  try {
    if (!["close", "open"].includes(action) || isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Malformed action or id" });
    }

    const updated = await Job.update(
      { isActive: action === "open", closeComment },
      { where: { id } }
    );

    if (updated[0] !== 1) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (action === "close") {
      await cancelAllApplicantsForJob(
        parseInt(id),
        undefined,
        closeComment,
        new Date(),
        "Position Frozen"
      );
    }

    res.json({ message: "Job updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Job.destroy({
      where: { id },
    });
    if (deleted === 0) return res.status(404).json({ error: "Job not found" });
    await Event.destroy({ where: { id: id } });
    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
