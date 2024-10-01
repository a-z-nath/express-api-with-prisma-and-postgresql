import { PORT } from "./secrets.js";
import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Base Router goes here

import { root } from "./routes/index.js";
import { ApiResponseHandler } from "./utils/ApiResponseHandler.js";
import { ApiErrorHandler } from "./utils/ApiErrorHandler.js";

app.use("/api/v1", root);

app.use((err, req, res, _) => {
  if (err instanceof ApiErrorHandler) {
    const statusCode = err.status || err.statusCode || 500;

    console.error(
      `[${req.method}] ${req.originalUrl} - ${statusCode} ${err.message}\n\n${err.stack}`
    );
    return res
      .status(statusCode)
      .json(
        new ApiResponseHandler(
          statusCode,
          {},
          err.message || "Internal Server Error"
        )
      );
  }

  console.error(`[${req.method}] ${req.originalUrl} ${res.statusCode}`);
});

app.listen(PORT, () => {
  console.log("Server is listening at", PORT);
  console.log(`Check it http://localhost:${PORT}`);
});
