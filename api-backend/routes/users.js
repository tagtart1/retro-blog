var express = require("express");
var router = express.Router();
const usersController = require("../controllers/usersController");

router.post("/log-in", usersController.logIn);

router.post("/log-out", usersController.logOut);

router.post("/sign-up", usersController.signUp);

module.exports = router;
