const AppError = require("../utils/appError");
const { validationResult } = require("express-validator");
require("dotenv").config();
const slugify = require("slugify");
const conn = require("../services/db");

exports.get = (req, res) => {
  let sqlQuery = "SELECT * FROM  total_win";

  conn.query(sqlQuery, (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: err,
      });
    } else {
      res.status(200).send({
        status: "success",
        length: result?.length,
        data: result,
      });
    }
  });
};

// add category
exports.register = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const title = req.body.total_win;
  // Generate slug from the title using slugify
  const slug = slugify(title, {
    replacement: "-", // replace spaces with -
    lower: true, // convert to lowercase
    remove: /[*+~%\<>/;.(){}?,'"!:@#^|]/g, // remove special characters
  });
  var date_time = new Date();
  const sqlQuery = `INSERT INTO total_win (total_win,total_loss,created_at, updated_at) VALUES (?,?, ?)`;
  const values = [
    req.body.total_win,
    req.body.total_loss,
    date_time,
    date_time,
  ];
  conn.query(sqlQuery, values, (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: err,
      });
    } else {
      res.status(200).send({
        status: "success",
        msg: "Adam total win Register successful",
      });
    }
  });
};

exports.edit = (req, res) => {
  let sqlQuery = "SELECT * FROM total_win WHERE id=" + req.params.id;
  conn.query(sqlQuery, (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: err,
      });
    } else {
      res.status(200).send({
        status: "success",
        length: result?.length,
        data: result,
      });
    }
  });
};
exports.update = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const title = req.body.total_win;
  // Generate slug from the title using slugify
  const slug = slugify(title, {
    replacement: "-", // replace spaces with -
    lower: true, // convert to lowercase
    remove: /[*+~%\<>/;.(){}?,'"!:@#^|]/g, // remove special characters
  });
  var date_time = new Date();
  const sqlQuery = `UPDATE total_win SET total_win=?,total_loss=?,updated_at=? WHERE id = ?;`;
  const values = [
    req.body.total_win,
    req.body.total_loss,
    date_time,
    req.params.id,
  ];
  conn.query(sqlQuery, values, (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: err,
      });
    } else {
      res.status(200).send({
        status: "success",
        msg: "Adam total win update successful",
      });
    }
  });
};
