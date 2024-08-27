const AppError = require("../utils/appError");
const conn = require("../services/db");

exports.getAllActiveCountry = (req, res, next) => {
  conn.query("SELECT * FROM countries", function (err, data, fields) {
    if (err) return next(new AppError(err));
    res.status(200).json({
      status: "success",
      length: data?.length,
      data: data,
    });
  });
};
