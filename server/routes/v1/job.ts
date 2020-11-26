import { Router, Response, Request } from "express";
import { where } from "sequelize/types";
//@ts-ignore
import { Student, Job, Event, Class } from "../../models";
import { IStudent, IJob } from "../../types";
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
          attributes: ["status", "date", "comment"],
        },
      ],
    });
    res.json(jobs);
  } catch (err) {
    res.status(500).send("error occurred");
  }
});

router.get("/byId/:id", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const job: IJob | null = await Job.findByPk(id, {
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
          attributes: ["status", "date", "comment"],
        },
      ],
    });
    if (job) {
      return res.json(job);
    } else {
      return res.status(404).send("Job does not exist");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const body: IJob = req.body;

    const {
      position,
      company,
      description,
      location,
      contact,
      requirements,
      additionalDetails,
    } = req.body;
    const newJob: IJob = {
      position,
      company,
      description,
      contact,
      location,
      requirements,
      additionalDetails,
    };
    const { value, error } = jobSchema.validate(newJob);
    if (error) return res.status(400).json(error);
    const job: IJob = await Job.create(newJob);
    res.json(job);
  } catch (err) {
    res.status(500).send("error occurred");
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const { value, error } = jobSchemaToPut.validate(req.body);
  if (error) return res.json(error);
  try {
    const updated = await Job.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated[0] === 1) return res.json({ msg: "Job updated" });
    res.status(404).send("Job not found");
  } catch (e) {
    res.status(500).send("error occurred");
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deleted = await Job.destroy({
      where: { id: req.params.id },
    });
    if (deleted === 0) return res.status(404).send("Job not found");
    await Event.destroy({ where: { jobId: req.params.id } });
    res.json({ msg: "Job deleted" });
  } catch (e) {
    res.status(500).send("error occurred");
  }
});

module.exports = router;
