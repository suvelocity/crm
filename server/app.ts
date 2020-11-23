import express, { Response, Request } from "express";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";

const app = express();
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(express.json());
app.use(morgan("tiny"));
app.use(helmet());

// app.use("/api", require("./routes"));
// app.use(express.static(path.join(__dirname, "..", "client", "build")));
// app.use("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
// });

app.use("/api", require("./routes"));
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});


export default app;
