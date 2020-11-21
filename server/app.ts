import express, { Response, Request } from "express";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";

const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(helmet());
app.use(express.static(path.join(__dirname, "../client/build")));

app.use("/api", require("./routes"));
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

export default app;
