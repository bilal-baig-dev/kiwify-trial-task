const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
module.exports = (schema) =>
  catchAsync(async (req, res, next) => {
    const resource = req.body;
    try {
      await schema.validate(resource);
      next();
    } catch (e) {
      const error = Array.isArray(e.errors)
        ? e.errors[0]
        : "Unknown error in validation schema middleware";
      return next(new AppError(error, 400));
    }
  });
