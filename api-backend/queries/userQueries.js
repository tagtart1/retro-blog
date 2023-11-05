const getUserByUsername = "SELECT * FROM users WHERE username = $1";
const addUser =
  "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *";

module.exports = {
  getUserByUsername,
  addUser,
};
