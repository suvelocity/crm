import express from "express";
import helmet from "helmet";
const api = express.Router();
api.use(helmet());

api.use("/v1", require("./v1"));

export default api;
