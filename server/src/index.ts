require('dotenv').config()
import app from "./app";

const PORT = process.env.PORT || 8080;
console.log(process.env.PORT)
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
