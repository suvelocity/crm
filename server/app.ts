import express, { Response, Request } from "express";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";

const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(helmet());

// app.use(express.static("../client/build"));

// app.get("/", (req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, "../client/build", "index.html"));
// });

app.use("/api", require("./routes"));

export default app;
