import { Router, Request, Response } from "express";
import axios from "axios";
const router = Router();
//@ts-ignore
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: __dirname + "/.env" });

let mockData = { organizationId: 1, secret: 123 };
let encodeSecret = process.env.CODE_REVIEW_SECRET;
let token = jwt.sign(mockData, encodeSecret);

// get all of a specific prokect's rules
router.get("/:projectId", async (req: Request, res: Response) => {
  try {
    let { data } = await axios.get(
      `http://localhost:8081/api/v1/rules/${req.params.projectId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.status(200).send(data);
    // res.send("Got To End Point")
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// add rules to a specific project
router.post("/bulk/:projectId", async (req, res) => {
  try {
    let newRules = req.body;
    let {
      data,
    } = await axios.post(
      `http://localhost:8081/api/v1/rules/bulk/${req.params.projectId}/`,
      newRules,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Got To POST End Point");
    res.status(201).send(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});
module.exports = router;
