import { Router } from "express";
import { asyncHandler } from "./../utils/asyncHandler.js";
import { authRouter } from "./auth.route.js";
import { userRouter } from "./user.route.js";

const root = Router();

root.get(
  "/user",
  asyncHandler((req, res) => {
    res.send("Hellos");
  })
);

root.use("/auth", authRouter);

root.use("/users", userRouter);

export { root };
