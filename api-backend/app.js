var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const cors = require("cors");
const AppError = require("./utils/appError");

var usersRouter = require("./routes/users");
const postRouter = require("./routes/posts");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://retro-blog-website.s3-website.us-east-2.amazonaws",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Routes
app.use("/api/v1/posts", postRouter);
app.use("/api/v1", usersRouter);

// Error Handler
app.use((err, req, res, next) => {
  if (err instanceof AppError && err.isOperational) {
    // Handle operational errors by returning a specific error message to the client.

    return res
      .status(err.statusCode)
      .json({ code: err.code, message: err.message });
  }

  // Handle other unknown errors.
  console.error("An unknown error occurred:", err);
  res
    .status(500)
    .json({ code: "UNKNOWN", message: "An unexpected error occurred" });
});

module.exports = app;
