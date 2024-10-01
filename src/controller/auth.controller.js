import prisma from "../db/db.config.js";
import { ApiErrorHandler } from "./../utils/ApiErrorHandler.js";
import { ApiResponseHandler } from "./../utils/ApiResponseHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (
      [fullName, email, password].some((field) => !field || field.trim() === "")
    ) {
      throw new ApiErrorHandler(400, "All Fields are Required");
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      throw new ApiErrorHandler(400, `User with email already exists`);
    }

    const userWithoutPass = await prisma.user.create({
      data: {
        fullName: fullName,
        email: email,
        password: bcrypt.hashSync(password, 10),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
        updateAt: true,
      },
    });

    return res.status(201).json(
      new ApiResponseHandler(
        201,
        {
          user: userWithoutPass,
        },
        `User Created Successfully`
      )
    );
  } catch (error) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    throw new ApiErrorHandler(
      500,
      error.message || `Unexprected error creating user`,
      error
    );
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    if ([email, password].some((field) => !field || field.trim() === "")) {
      throw new ApiErrorHandler(400, "All Fields are Required");
    }
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new ApiErrorHandler(400, `User doesn't exists`);
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new ApiErrorHandler(400, `Invalid Password`);
    }

    const accessToken = await jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const { password: _, ...userWithoutPass } = user;
    const options = {
      httpOnly: true,
      secure: true, // Ensure secure cookies
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponseHandler(
          200,
          {
            user: userWithoutPass,
            accessToken: accessToken,
          },
          "Log In Successful"
        )
      );
  } catch (error) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    throw new ApiErrorHandler(
      500,
      error.message || `Unexpected Error Logging In`,
      error
    );
  }
});

export const logout = asyncHandler(async (req, res) => {
  try {
    if (!req.user) {
      throw new ApiErrorHandler(401, "Unauthorized Request");
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS in production
      sameSite: "strict",
    });

    res
      .status(200)
      .json(new ApiResponseHandler(200, {}, "Log Out Successfully"));
  } catch (error) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    throw new ApiErrorHandler(500, err.message || "Unexpected Error", error);
  }
});
