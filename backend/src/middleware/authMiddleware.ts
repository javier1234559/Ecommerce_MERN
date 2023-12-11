import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User, { IUser } from "../models/userModel.js";
import { Request, Response, NextFunction } from "express";
import { IEncoded, IUserPayload } from "../types/types.js";

// User must be authenticated
const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Read JWT from the 'jwt' cookie

    let token = req.cookies.jwt;

    if (token) {
      try {
        if (!process.env.JWT_SECRET) {
          throw new Error(
            "JWT_SECRET is not defined in the environment variables"
          );
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as IEncoded;

        const user: IUserPayload = await User.findById(decoded.userId).select(
          "-password"
        );
        req.user = user;

        next();
      } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    } else {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  }
);

// User must be an admin
const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
};

export { protect, admin };
