require('dotenv').config()
import app from "./app";
// require("dotenv").config();

console.log('port',process.env.PORT)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
