import express from "express";
import helmet from "helmet";
import v1 from './v1'
const api = express.Router();
api.use(helmet());

api.use("/v1", v1);

export default api;
