import { Router, Request, Response } from "express";
import axios from "axios";
const router = Router();
//@ts-ignore
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: __dirname + "/.env" });

let mockData = { organizationId: 1, secret: 123 };
let encodeSecret = process.env.CODE_REVIEW_SECRET;
let token = jwt.sign(mockData, encodeSecret);

// get all the organization's projects
router.get("/", async (req: Request, res: Response) => {
  try {
    let { data } = await axios.get("http://localhost:8081/api/v1/projects/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.status(200).send(data);
    // res.send("Got To End Point")
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// post new project
router.post("/", async (req: Request, res: Response) => {
  try {
    let name = req.body.name;
    let { data } = await axios.post(
      "http://localhost:8081/api/v1/projects/",
      { name },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Got To POST End Point");
    res.status(201).send(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// delete a specific project
router.delete("/:projectId", async (req: Request, res: Response) => {
  try {
    let name = req.body.name;
    await axios.delete(
      `http://localhost:8081/api/v1/projects/${req.params.projectId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("\nGot To DELETE End Point\n");
    res.status(200).send("Deleted project");
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// TODO create a pr
router.post("/pull-requests", async (req: Request, res: Response) => {
  try {
    let newPr = req.body;
    let {
      data,
    } = await axios.post(
      `http://localhost:8081/api/v1/projects/pull-requests`,
      newPr,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("\nGot To create new pr End Point\n");
    res.status(201).send(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});
// TODO get a specific pull request
router.get("/pull-requests/:userId", async (req: Request, res: Response) => {});

// TODO get all pull requests per organization
router.get(
  "/by-organization/:organizationId/pull-requests",
  async (req: Request, res: Response) => {
    try {
      console.log(token);

      let {
        data,
      } = await axios.get(
        `http://localhost:8081/api/v1/projects/by-organization/${req.params.organizationId}/pull-requests`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data === undefined) {
        res.status(200).send("no pull request found");
      } else {
        data.length > 0
          ? res.status(200).send(data)
          : res.status(200).send("no pull request found");
      }
    } catch (error) {
      res.status(404).send(error);
    }
  }
);
// TODO get all pull requests per specific project
router.get(
  "/:projectId/pull-requests",
  async (req: Request, res: Response) => {}
);
// TODO remove a specific pull request
router.delete(
  "/:projectId/pull-requests/:pullRequestId",
  async (req: Request, res: Response) => {
    try {
      await axios.delete(
        `http://localhost:8081/api/v1/projects/${req.params.projectId}/pull-requests/${req.params.pullRequestId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("\nGot To DELETE End Point\n");
      res.status(200).send("deleted pull request");
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
);
// TODO adds rules to a specific project
router.post("/:projectId/add-rules", async (req: Request, res: Response) => {});

// TODO remove rules from a specific project
router.delete(
  "/:projectId/remove-rules",
  async (req: Request, res: Response) => {}
);
module.exports = router;
