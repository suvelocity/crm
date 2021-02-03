import { Router, Request, Response } from "express";
import axios from "axios";
//@ts-ignore
import { Event, Student, Job, Company, Class } from "../../models";
import { IEvent, IJob, IStudent } from "../../types";
import { eventsSchema } from "../../validations";
import { validateTeacher } from "../../middlewares";

const router = Router();

router.post("/team", validateTeacher, async (req, res) => {
  const { MY_URL: url, CM_ACCESS: cmAccess } = process.env;
  if (!url) {
    throw "no url!";
  }
  if (!cmAccess) {
    throw "no cm Access!";
  }
  try {
    const { body } = req;
    body.eventsRegistration = {
      webhookUrl: url + "/api/v1/webhook/event",
      events: ["Started Challenge", "Submitted Challenge"],
      authorizationToken: cmAccess,
    };
    console.log(url + "/api/v1/webhook/event");
    const { data: team } = await axios.post(
      "http://35.239.15.221/api/v1/webhooks/teams",
      body,
      {
        headers: {
          Authorization: cmAccess,
          contentType: "application/json",
        },
      }
    );
    res.json(team);
  } catch (err) {
    console.error(err);
    res.json({ status: "error", message: err.message });
  }
});
router.post("/signup", validateTeacher, async (req, res) => {
  const { MY_URL: url, CM_ACCESS: cmAccess } = process.env;
  if (!url) {
    throw "no url!";
  }
  if (!cmAccess) {
    throw "no cm Access!";
  }
  try {
    const { body } = req;
    body.eventsRegistration = {
      webhookUrl: url + "/api/v1/webhook/event",
      events: ["submittedChallenge", "startedChallenge"],
      authorizationToken: cmAccess,
    };
    console.log(url + "/api/v1/webhook/event");
    const { data: team } = await axios.post(
      "http://35.239.15.221/api/v1/webhooks/teams",
      body,
      {
        headers: {
          Authorization: cmAccess,
          contentType: "application/json",
        },
      }
    );
    res.json(team);
  } catch (err) {
    console.error(err);
    res.json({ status: "error", message: err.message });
  }
});

router.post("/event", async (req, res) => {
  const { body } = req;
  console.log("CM event received");
  console.log(body);
  res.status(200).send("received");
});

export default router;
