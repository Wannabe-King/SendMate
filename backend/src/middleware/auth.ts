import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const headers = req.headers.authorization;
  if (!headers || !headers.startsWith("Bearer ")) {
    res.status(411).send({
      message: "Unauthorized user please try again.",
    });
    return;
  }
  const token = headers.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.userId = decodedToken.userId;
    next();
  } catch (e) {
    res.status(411).send({
      message: "Unauthorized user please try again.",
      error: e,
    });
  }
};
