require("dotenv").config();
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function checkToken(req: Request, res: Response, next: NextFunction) {
  //   console.log(req.url);
  let token: string | undefined | string[] = req.headers.authorization;
  if (!token || Array.isArray(token))
    return res.status(400).json({ error: "No token sent" });
  token = token.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET!,
    (err: Error | null, decoded: any) => {
      if (err) {
        return res.status(403).json({ error: err });
      }
      //@ts-ignore
      req.user = decoded;
      next();
    }
  );
}
