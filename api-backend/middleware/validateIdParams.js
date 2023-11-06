const AppError = require("../utils/appError");

const validateIdParams = (req, res, next) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    throw new AppError("Invalid ID Formmat", 400, "BAD_REQUEST");
  } else next();
};

module.exports = validateIdParams;
