import express, { Response, Request } from "express";
import morgan from "morgan";
import helmet from "helmet";
import mongoose from "mongoose";
import "./models/student.model";
import "./models/job.model";

const url = process.env.DB_URI;

console.log(`trying to connect to DB`);
// console.log("Amir is a SNAKE");
// console.log("Shahr is an ASS");
// console.log("I Love Tomer ");
// console.log("Nitzan is a LORD");
mongoose.set("useFindAndModify", false);

mongoose
  .connect(url!, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((r) => console.log("connected successfully to DB"))
  .catch((e) => console.log(`failed to connect to MongoDB\n${e.message}`));

const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(helmet());

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>This is CRM</h1>");
});

app.use("/api", require("./routes"));

export default app;
