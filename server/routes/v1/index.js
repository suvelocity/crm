const { Router } = require("express");
const router = Router();
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};
router.use("/classroom", require("./classroom"));

router.use(unknownEndpoint);
module.exports = router;
