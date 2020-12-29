import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
//@ts-ignore
import { User, RefreshToken, Student, Teacher } from "../../models";
import bcrypt from "bcryptjs";

require("dotenv").config();

const router = Router();

const fifteenMinutes = () => Math.floor(Date.now() / 1000) + 15 * 60;
const oneDay = () => Math.floor(Date.now() / 1000) + 24 * 60 * 60;

router.post("/token", async (req: Request, res: Response) => {
  const { refreshToken, remembered } = req.body;
  if (!refreshToken) return res.status(400).json({ error: "No refresh token" });
  try {
    const data = await RefreshToken.findOne({
      where: { token: refreshToken },
    });
    if (!data.token)
      return res.status(404).json({ error: "Refresh token not found" });
    jwt.verify(
      data.token,
      process.env.REFRESH_TOKEN_SECRET!,
      async (err: Error | null, decoded: any) => {
        if (err) {
          return res.status(401).json({ error: "Not authorized" });
        }
        const data = { ...decoded, exp: fifteenMinutes() };
        delete data.iat;
        const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET!);
        res.cookie("accessToken", accessToken);
        if (remembered) {
          const student = await Student.findOne({
            where: { email: decoded.email },
          });
          if (student) {
            return res.json({ ...student, userType: decoded.type });
          }
          const teacher = await Teacher.findOne({
            where: { email: decoded.email },
          });
          if (teacher) {
            return res.json({ ...teacher, userType: decoded.type });
          }
        }
        res.json({ userType: decoded.type });
      }
    );
  } catch (err) {
    console.trace(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/signin", async (req: Request, res: Response) => {
  const { email, password, rememberMe } = req.body;
  try {
    const user = await User.findOne({
      where: { email },
    });
    if (!user)
      return res.status(400).json({ error: "Email or password are incorrect" });
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ error: "Email or password are incorrect" });
    }
    const exp = oneDay() * (rememberMe ? 365 : 1);
    const accessTokenExp = fifteenMinutes();
    const data = { email, type: user.type, exp };
    const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET!);
    const accessToken = jwt.sign(
      { ...data, exp: accessTokenExp },
      process.env.ACCESS_TOKEN_SECRET!
    );
    await RefreshToken.create({ token: refreshToken });
    res.cookie("refreshToken", refreshToken);
    res.cookie("accessToken", accessToken);
    switch (user.type) {
      case "student":
        const student = await Student.findByPk(user.relatedId);
        if (student) {
          return res.json({ ...student, userType: user.type });
        }
        return res.status(400).json({ error: "Student not found" });
      case "admin":
        return res.json({ userType: "admin" });
      case "teacher":
        const teacher = await Teacher.findByPk(user.relatedId);
        if (teacher) {
          return res.json({ ...teacher, userType: user.type });
        }
      default:
        return res.status(400).json({ error: "Unknown user type" });
    }
  } catch (err) {
    console.trace(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/signout", async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;
  try {
    const deletedToken = await RefreshToken.destroy({
      where: {
        token,
      },
    });
    if (deletedToken) return res.json({ success: true });
    return res.json({ error: "Error occurred" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
