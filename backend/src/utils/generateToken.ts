import jwt from "jsonwebtoken";
import { Response } from "express";

const generateToken = (res: Response, userId: string) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }

  const token = jwt.sign({ userId }, jwtSecret, {
    expiresIn: "30d",
  });
  // Set JWT as an HTTP-Only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateToken;
