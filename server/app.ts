import express, { Response, Request } from "express";
import morgan from "morgan";
import helmet from "helmet";
import mongoose from "mongoose";
import "./models/student.model";
import "./models/job.model";
import path from "path";

const url = process.env.DB_URI;

console.log(`trying to connect to DB`);
mongoose.set("useFindAndModify", false);

mongoose
  .connect(url!, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((r) => console.log("connected successfully to DB"))
  .catch((e) => console.log(`failed to connect to MongoDB\n${e.message}`));

const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(helmet());

app.use(express.static("../client/build"));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.use("/api", require("./routes"));

export default app;
