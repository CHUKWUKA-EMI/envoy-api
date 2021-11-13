import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const freePaths = [
    "/api/v1/user/signup",
    "/api/v1/user/signup/",
    "/api/v1/user/login",
    "/api/v1/user/login/",
    "/api/v1/user/activate-user",
    "/api/v1/user/activate-user/",
    "/api/v1/user/reset-password",
    "/api/v1/user/reset-password/",
  ];
  if (
    freePaths.includes(req.path) ||
    req.path.startsWith("/api/v1/user/activate-user")
  ) {
    return next();
  }

  if (req.header("Authorization") === undefined) {
    return res.status(401).json("Authentication Failed");
  }
  const token = req.header("Authorization")!.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  if (!decoded) {
    return res.status(401).json("Authentication Failed");
  }

  (<any>req).user = decoded;
  return next();
};

export default authenticate;
