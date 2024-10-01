import prisma from "../db/db.config.js";
import { ApiErrorHandler } from "../utils/ApiErrorHandler.js";
import { ApiResponseHandler } from "../utils/ApiResponseHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.p) || 1;
  const count = parseInt(req.query.c) || 10;
  const sortBy = req.query.s === "asc" ? "asc" : "desc";

  try {
    const totalUser = await prisma.user.count();
    const users = await prisma.user.findMany({
      skip: (page - 1) * count,
      take: count,
      orderBy: {
        createdAt: sortBy,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    });
    return res.status(200).json(
      new ApiResponseHandler(
        200,
        {
          totalUser: totalUser,
          user: users,
        },
        "User retrived successfully"
      )
    );
  } catch (error) {
    if (error instanceof ApiErrorHandler) throw error;
    throw new ApiErrorHandler(
      500,
      error.message || "Unexpected error retriving users",
      error?.error,
      error.stack
    );
  }
});

export const getUserById = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const id = parseInt(userId);
    const _user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!_user) {
      throw new ApiErrorHandler(400, "User doesn't exists with ID:" + userId);
    }

    const { password: _password, ...user } = _user;

    return res.status(200).json(
      new ApiResponseHandler(
        200,
        {
          user: user,
        },
        "User with ID: " + userId + " retrived successfully"
      )
    );
  } catch (error) {
    if (error instanceof ApiErrorHandler) throw error;
    throw new ApiErrorHandler(
      500,
      error.message || "Unexpected error retriving users",
      error?.error,
      error.stack
    );
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  try {
    const { email, fullName } = req.body;
    const { userId: _userId } = req.params;

    const userId = parseInt(_userId);

    if ([email, fullName].some((field) => !field || field.trim() === "")) {
      throw new ApiErrorHandler(400, "All Fields are Required");
    }
    const _userWithEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (_userWithEmail && _userWithEmail.id !== userId) {
      // email of another user
      throw new ApiErrorHandler(400, `User with email exists`);
    }
    let updateData = { fullName };
    if (!_userWithEmail) {
      // no user with given email
      updateData["email"] = email;
    }
    const _user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
    });

    const { password: _, ...user } = _user;

    return res.status(200).json(
      new ApiResponseHandler(
        200,
        {
          user: user,
        },
        "User Details updated successfully"
      )
    );
  } catch (error) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }

    throw new ApiErrorHandler(
      500,
      error.message || "Unexpected Error updating user details",
      error?.error,
      error?.stack
    );
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { userId: _userId } = req.params;
    const userId = parseInt(_userId);

    const _userWithId = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!_userWithId) {
      throw new ApiErrorHandler(400, `User with ID exists`);
    }

    const _ = await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return res
      .status(200)
      .json(new ApiResponseHandler(200, {}, "User deleted successfully"));
  } catch (error) {
    if (error instanceof ApiErrorHandler) throw error;
    throw new ApiErrorHandler(
      500,
      error.message || "Unexpected error retriving users",
      error?.error,
      error.stack
    );
  }
});
