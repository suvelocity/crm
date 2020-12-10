import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
//@ts-ignore
import { User, RefreshToken } from "../../models";
import bcrypt from "bcryptjs";

require("dotenv").config();

const router = Router();

router.post("/token", async (req: Request, res: Response) => {
  const { refreshToken, email } = req.body;
  if (!refreshToken) return res.status(400).json({ error: "No refresh token" });
  try {
    const token = await RefreshToken.findOne({
      where: { token: refreshToken },
    });
    if (!token)
      return res.status(404).json({ error: "Refresh token not found" });
    const data = { email, exp: Math.floor(Date.now() / 1000) + 15 * 60 };
    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
    res.cookie("accessToken", accessToken);
    res.send(true);
  } catch (err) {
    res.json({ error: err.message }).status(500);
  }
});

router.post("signIn", async (req: Request, res: Response) => {
  const { username, password, rememberMe } = req.body;
  try {
    const user = await User.findOne({
      where: { username },
    });
    if (!user) return res.json(404).json({ error: "User not found" });
    if (!bcrypt.compareSync(password, user.password))
      return res.json(400).json({ error: "Wrong password" });
    const exp =
      Math.floor(Date.now() / 1000) + 24 * 60 * 60 * (rememberMe ? 365 : 1);
    const data = { email: username, exp };
    const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
    res.cookie("refreshToken", refreshToken);
    res.sendStatus(204);
  } catch (err) {
    res.json({ error: err.message });
  }
});

router.post("signOut", async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  try {
    const deletedToken = await RefreshToken.destroy({
      where: {
        refreshToken,
      },
    });
    if (deletedToken) return res.json({ success: true });
    return res.json({ error: "Error occurred" });
  } catch (err) {
    res.json({ error: err.message });
  }
});

export default router;
