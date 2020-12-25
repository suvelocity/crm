import app from "./app";

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
