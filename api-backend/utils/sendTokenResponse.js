const jwt = require("jsonwebtoken");

const sendTokenResponse = (user, statusCode, req, res, next) => {
  const jwtUser = {
    id: user.id,
    username: user.username,
  };

  jwt.sign(
    { user: jwtUser },
    process.env.SECRETKEY,
    { expiresIn: "3h" },
    (err, token) => {
      if (err) return next(err);

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 10800000,
        path: "/",
      });

      res.json({
        data: jwtUser,
      });
    }
  );
};

module.exports = sendTokenResponse;
