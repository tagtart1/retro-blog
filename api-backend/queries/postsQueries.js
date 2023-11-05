const getPosts = "SELECT * FROM posts WHERE is_draft = false";
const getDraftPostsByUser = "SELECT * FROM posts WHERE is_draft = true";

const getPostsByUser =
  "SELECT * FROM posts WHERE is_draft = false AND author_id = $1";

const getPostById = "SELECT * FROM posts WHERE id = $1";

const addPost =
  "INSERT INTO posts (title, text, author_id, is_draft) VALUES ($1, $2, $3, $4) RETURNING *";

const deletePost = "DELETE FROM posts WHERE id = $1 RETURNING *";
const updatePost =
  "UPDATE posts SET title = $1, text = $2, is_draft = $3 WHERE id = $4 RETURNING *";

module.exports = {
  getPosts,
  getPostById,
  addPost,
  deletePost,
  updatePost,
};
