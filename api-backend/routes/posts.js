var express = require("express");
var router = express.Router();
const postsController = require("../controllers/postsController");
const validateIdParams = require("../middleware/validateIdParams");

// posts routes
router.get("/", postsController.getAllPosts);
router.post("/", postsController.addPost);

router.get("/:id", validateIdParams, postsController.getPostById);
router.delete("/:id", validateIdParams, postsController.deletePost);

router.patch("/:id", validateIdParams, postsController.updatePost);

module.exports = router;
