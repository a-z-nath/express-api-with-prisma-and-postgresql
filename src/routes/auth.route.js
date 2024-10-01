import { Router } from "express";
import { createUser, login, logout } from "../controller/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/signup", createUser);

authRouter.post("/login", login);

authRouter.post("/logout", verifyJWT, logout);

export { authRouter };
