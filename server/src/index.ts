const env = process.env.NODE_ENV || "development";
require("dotenv").config();
import app from "./app";

const port = process.env.PORT || 8080;

// async function establishConnection() {
//   const ngrok = require('ngrok');
//   const url = await ngrok.connect(port);
//   process.env.MY_URL = url;
//   console.log('MY_URL', process.env.MY_URL);
// }
// if (env === 'development') {
//   establishConnection()
// }

console.log("port", process.env.PORT);
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
