var express = require("express");
var router = express.Router();
const postsController = require("../controllers/postsController");
const validateIdParams = require("../middleware/validateIdParams");
const validateToken = require("../middleware/validateToken");

// posts routes
router.get("/", postsController.getAllPosts);
router.get("/drafts", validateToken, postsController.getDraftsFromUser);
router.post("/", validateToken, postsController.addPost);

router.get("/:id", validateIdParams, postsController.getPostById);
router.delete(
  "/:id",
  validateToken,
  validateIdParams,
  postsController.deletePost
);

router.patch(
  "/:id",
  validateToken,
  validateIdParams,
  postsController.updatePost
);

module.exports = router;
