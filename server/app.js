const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(helmet());

app.use(require("./routes/v1"));
module.exports = app;
