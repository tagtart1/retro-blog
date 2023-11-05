const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const userQueries = require("../queries/userQueries");
const { body, validationResult } = require("express-validator");
const pool = require("../db");
require("dotenv").config();
const sendTokenResponse = require("../utils/sendTokenResponse");

exports.logIn = asyncHandler(async (req, res, next) => {
  const inputUsername = req.body.username;
  const inputPassword = req.body.password;

  // Null values fail credential check automatically
  if (!inputPassword || !inputUsername) {
    throw new AppError(
      "The username or password provided is incorrect",
      401,
      "INVALID_CREDENTIALS"
    );
  }

  // Find user
  const user = await pool.query(userQueries.getUserByUsername, [inputUsername]);

  // Authenticate password
  const result = await bcrypt.compare(inputPassword, user.rows[0].password);
  if (!result) {
    console.log("failed compare");
    throw new AppError(
      "The username or password provided is incorrect",
      401,
      "INVALID_CREDENTIALS"
    );
  }

  // Fail with credentials to not reveal if user truly exists or not
  if (!user.rows.length) {
    throw new AppError(
      "The username or password provided is incorrect",
      401,
      "INVALID_CREDENTIALS"
    );
  }

  sendTokenResponse(user.rows[0], 200, req, res, next);
});

exports.logOut = (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.status(200).json({ data: { message: "Logged out successfully" } });
};

exports.signUp = [
  body("username", "Must have a username")
    .trim()
    .isLength({ min: 1 })
    .isAlphanumeric()
    .withMessage("Username can only contain letters and numbers")
    .escape(),
  body("password")
    .isLength({ min: 1 })
    .withMessage("Password must contain 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/
    )
    .withMessage(
      "Password should have at least one uppercase letter, one number, and one special character"
    ),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((err) => err.msg);

      throw new AppError(formattedErrors[0], 400, "VALIDATION_ERROR");
    }
    // Check if user already exists
    const usernameTaken = await pool.query(userQueries.getUserByUsername, [
      req.body.username,
    ]);
    if (usernameTaken.rows.length !== 0) {
      throw new AppError("Username already taken", 400, "VALIDATION_ERROR");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = await pool.query(userQueries.addUser, [
      req.body.username,
      hashedPassword,
    ]);

    if (!newUser) {
      throw new AppError("Failed to sign up", 500, "SERVER_ERROR");
    }

    sendTokenResponse(newUser.rows[0], 201, req, res, next);
  }),
];
