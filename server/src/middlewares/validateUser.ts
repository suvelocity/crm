import { Request, Response, NextFunction } from "express";
import { IUser, RequestWithUser } from "../types";

export function validateAdmin(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    console.error("no user");
    console.log("USER");
    console.log(req.user);
    return res.status(500).json({ error: "validation error" });
  }
  if (req.user && req.user.type !== "admin")
    return res.status(401).json({ error: "Not Authorized" });
  next();
}

export function validateTeacher(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    console.error("no user");
    console.log("USER");
    console.log(req.user);
    return res.status(500).json({ error: "validation error" });
  }
  if (req.user && req.user.type !== "admin" && req.user.type !== "teacher")
    return res.status(401).json({ error: "Not Authorized" });
  next();
}
