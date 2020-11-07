import express, { Response, Request } from "express";
import morgan from "morgan";
import helmet from "helmet";

const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(helmet());

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>This is CRM</h1>");
});
app.use(require("./routes/v1"));

export default app;
