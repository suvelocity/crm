import { RequestWithUser } from "../types";
import { Response, NextFunction } from "express";
export function forwardRequest(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    console.log("Forwarding function didn't get the user in req");
    return res.status(500).json({ error: "server error" });
  }
  const validTypes = ["admin", "student", "teacher"];
  const userType = req.user.type;
  if (validTypes.includes(req.user.type)) {
    req.url = `/${userType}${req.url}`;
    next();
  } else {
    res.status(401).json({ error: "Invalid user type" });
  }
}
