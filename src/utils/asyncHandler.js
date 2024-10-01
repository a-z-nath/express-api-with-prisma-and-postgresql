import prisma from "../db/db.config.js";

export const asyncHandler = (method) => {
  return (req, res, next) => {
    Promise.resolve(method(req, res, next)).catch(async (err) => {
      res;
      next(err);
    });
  };
};
