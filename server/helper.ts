import { Request, Response, Router, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined | string[] = req.headers.authorization;
  if (!token || Array.isArray(token))
    return res.status(403).json({ error: "No token send" });
  token = token.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err: Error, decoded: any) => {
      //TODO change
      if (err) {
        return res.status(403).json({ error: "Not authorized" });
      }
      //@ts-ignore
      req.user = decoded;
      //TODO change
      next();
    }
  );
};
