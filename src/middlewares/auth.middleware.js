import prisma from "../db/db.config.js";
import { JWT_SECRET } from "../secrets.js";
import { ApiErrorHandler } from "../utils/ApiErrorHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiErrorHandler(401, "Unauthorized Request");
    }

    const decodedToken = await jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        email: decodedToken.email,
      },
    });

    if (!user) {
      throw new ApiErrorHandler(401, "Invalid Access Token");
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Unexpected Error verifying JWT token: ", error);
    throw new ApiErrorHandler(
      401,
      error.message || "Invalid Access Token",
      error
    );
  }
};
