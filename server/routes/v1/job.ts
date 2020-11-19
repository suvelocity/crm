import { Router, Response, Request } from "express";
import { where } from "sequelize/types";
//@ts-ignore
import { Student, Job, Event, Class } from "../../models";
import { IStudent, IJob } from "../../types";
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
            },
          ],
          attributes: ["status", "createdAt"],
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
            },
          ],
          attributes: ["status", "createdAt"],
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
      id,
      position,
      company,
      description,
      location,
      contact,
      requirements,
      additionalDetails,
    } = req.body;
    const newJob: IJob = {
      id,
      position,
      company,
      description,
      contact,
      location,
      requirements,
      additionalDetails,
    };
    const job: IJob = await Job.create(newJob);
    res.json(job);
  } catch (err) {
    res.status(500).send("error occurred");
  }
});

router.put("/:id", async (req: Request, res: Response) => {
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
