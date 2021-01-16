import express, { Response, Request } from "express";
import morgan from "morgan";
import path from "path";
import routes from "./routes";

const app = express();
app.use(express.static("../../client/build"));
app.use(express.json());
app.use(morgan("tiny"));

app.use((req, res, next) => {
  console.log(req.body);
  next();
});

app.use("/api", routes);
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "../../client/build", "index.html"));
});

export default app;
