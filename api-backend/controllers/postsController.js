const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const postsQueries = require("../queries/postsQueries");
const pool = require("../db");
const AppError = require("../utils/appError");

const jwt = require("jsonwebtoken");

// GET all non draft posts
exports.getAllPosts = asyncHandler(async (req, res) => {
  const userId = req.query.user_id;
  const query = userId ? postsQueries.getPostsByUser : postsQueries.getPosts;
  const params = userId ? [userId] : [];

  pool.query(query, params, (err, results) => {
    if (err)
      throw new AppError("Could not retrieve posts", 400, "SERVER_ERROR");

    res.status(200).json({ data: { posts: results.rows } });
  });
});

// GET all posts from user

// GET all draft posts from user
exports.getDraftsFromUser = asyncHandler(async (req, res) => {
  const results = await pool.query(postsQueries.getDraftPostsByUser, [
    req.user.id,
  ]);

  res.status(200).json({ data: { posts: results.rows } });
});

// GET specific post

exports.getPostById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const results = await pool.query(postsQueries.getPostById, [id]);

  if (results.rows.length === 0) {
    throw new AppError("Post not found", 404, "NOT_FOUND");
  }

  res.status(200).json({ data: { post: results.rows[0] } });
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
    console.log("hey");
    const inputErrors = validationResult(req);

    if (!inputErrors.isEmpty()) {
      const formattedErrors = inputErrors.array().map((err) => err.msg);

      throw new AppError(formattedErrors[0], 400, "INPUT_ERROR");
    }

    const newPost = {
      title: req.body.title,
      text: req.body.text,
      is_draft: req.body.isDraft,
      author_id: req.user.id,
    };

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
      console.log("ERROR");
      throw new AppError(formattedErrors[0], 400, "INPUT_ERROR");
    }

    const update = {
      title: req.body.title,
      text: req.body.text,
      isDraft: req.body.isDraft,
    };
    // Can also seperate concerns like we did in the delete operation
    const result = await pool.query(postsQueries.findAndUpdatePost, [
      update.title,
      update.text,
      update.isDraft,
      id,
      req.user.id,
    ]);
    if (!result.rows.length) {
      throw new AppError("Invalid permissions", 403, "INVALID_CREDENTIALS");
    }
    res.status(200).json({ data: { post: result.rows[0] } });
  }),
];

exports.deletePost = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const post = await pool.query(postsQueries.getPostById, [id]);
  const postToDelete = post.rows[0];
  if (!postToDelete) {
    throw new AppError("Post not found", 404, "NOT_FOUND");
  }

  if (postToDelete.author_id !== req.user.id) {
    throw new AppError("Invalid Permissions", 403, "INVALID_CREDENTIALS");
  }

  const deletedPost = await pool.query(postsQueries.deletePost, [id]);

  res.status(200).json({ data: { post: deletedPost.rows[0] } });
});
