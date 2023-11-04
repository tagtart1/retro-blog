const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const postsQueries = require("../queries/postsQueries");
const pool = require("../db");
const AppError = require("../utils/appError");

const jwt = require("jsonwebtoken");

// GET all non draft posts
exports.getAllPosts = asyncHandler(async (req, res) => {
  pool.query(postsQueries.getPosts, (err, results) => {
    if (err)
      throw new AppError("Could not retrieve posts", 400, "SERVER_ERROR");

    res.status(200).json({ data: { posts: results.rows } });
  });
});

// GET specific post

exports.getPostById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const results = await pool.query(postsQueries.getPostById, [id]);

  if (results.rows.length === 0) {
    throw new AppError("Post not found", 404, "NOT_FOUND");
  }

  res.status(200).json({ data: { post: results.rows } });
});

// POST new post

exports.addPost = [
  body("title", "Must include a title").trim().isLength({ min: 1 }).escape(),
  body("text")
    .trim()
    .isLength({ min: 1 })
    .withMessage("You can't post an empty blog!")
    .escape(),
  body("isDraft").isBoolean(),
  asyncHandler(async (req, res) => {
    const inputErrors = validationResult(req);

    const newPost = {
      title: req.body.title,
      text: req.body.text,
      is_draft: req.body.isDraft,
    };

    // VERIFY JWT TO GET AUTHOR ID

    newPost.author_id = 1;

    if (!inputErrors.isEmpty()) {
      const formattedErrors = inputErrors.array().map((err) => err.msg);

      throw new AppError(formattedErrors[0], 400, "INPUT_ERROR");
    }

    // Add post
    const results = await pool.query(postsQueries.addPost, [
      newPost.title,
      newPost.text,
      newPost.author_id,
      newPost.is_draft,
    ]);

    res.status(201).json({ data: { post: results.rows[0] } });
  }),
];

exports.updatePost = [
  body("title", "Must include a title").trim().isLength({ min: 1 }).escape(),
  body("text")
    .trim()
    .isLength({ min: 1 })
    .withMessage("You can't post an empty blog!")
    .escape(),
  body("isDraft").isBoolean(),
  asyncHandler(async (req, res) => {
    const id = req.params.id;

    const inputErrors = validationResult(req);

    if (!inputErrors.isEmpty()) {
      const formattedErrors = inputErrors.array().map((err) => err.msg);

      throw new AppError(formattedErrors[0], 400, "INPUT_ERROR");
    }

    const update = {
      title: req.body.title,
      text: req.body.text,
      isDraft: req.body.isDraft,
    };

    const result = await pool.query(postsQueries.updatePost, [
      update.title,
      update.text,
      update.isDraft,
      id,
    ]);
    if (!result.rows.length) {
      throw new AppError("Post not found", 404, "NOT_FOUND");
    }
    res.status(200).json({ data: { post: result.rows[0] } });
  }),
];

exports.deletePost = asyncHandler(async (req, res) => {
  const id = req.params.id;

  // WRAP IN jwt.verify
  const postToDelete = await pool.query(postsQueries.deletePost, [id]);
  if (!postToDelete.rows.length) {
    throw new AppError("Post not found", 404, "NOT_FOUND");
  }
  res.status(200).json({ data: { post: postToDelete.rows[0] } });
});
