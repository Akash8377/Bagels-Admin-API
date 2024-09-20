const AppError = require("../utils/appError");
const { validationResult } = require("express-validator");
require("dotenv").config();
const slugify = require("slugify");
const conn = require("../services/db");

exports.get = (req, res) => {
  let sqlQuery = "SELECT * FROM  wade_picks";

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
  const title = req.body.home_team;
  // Generate slug from the title using slugify
  const slug = slugify(title, {
    replacement: "-", // replace spaces with -
    lower: true, // convert to lowercase
    remove: /[*+~%\<>/;.(){}?,'"!:@#^|]/g, // remove special characters
  });
  var date_time = new Date();
  const sqlQuery = `INSERT INTO wade_picks (week_id,home_team,away_team,home_image,away_image,winning_team,winning_value,created_at, updated_at) VALUES (?,?, ?, ?, ?, ?, ?,?, ?)`;
  const values = [
    req.body.week_id,
    req.body.home_team,
    req.body.away_team,
    req.body.home_image,
    req.body.away_image,
    req.body.winning_team,
    req.body.winning_value,
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
        msg: "Top Register successful",
      });
    }
  });
};

exports.edit = (req, res) => {
  let sqlQuery = "SELECT * FROM wade_picks WHERE id=" + req.params.id;
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
  const title = req.body.home_team;
  // Generate slug from the title using slugify
  const slug = slugify(title, {
    replacement: "-", // replace spaces with -
    lower: true, // convert to lowercase
    remove: /[*+~%\<>/;.(){}?,'"!:@#^|]/g, // remove special characters
  });
  var date_time = new Date();
  const sqlQuery = `UPDATE wade_picks SET week_id=?,home_team = ?,away_team = ?,home_image = ?,away_image = ?,winning_team=?,winning_value=?,updated_at=? WHERE id = ?;`;
  const values = [
    req.body.week_id,
    req.body.home_team,
    req.body.away_team,
    req.body.home_image,
    req.body.away_image,
    req.body.winning_team,
    req.body.winning_value,
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
        msg: "Top update successful",
      });
    }
  });
};

exports.delete = (req, res) => {
  let sqlQuery = "DELETE FROM wade_picks WHERE id=" + req.params.id + "";

  conn.query(sqlQuery, (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: err,
      });
    } else {
      res.status(200).send({
        status: "success",
        msg: "Top delete successful",
      });
    }
  });
};

exports.status = (req, res) => {
  const status = req.body.status; // This should be "active" or "inactive"
  const id = req.params.id;
  const sqlQuery = `UPDATE wade_picks SET status = ? WHERE id = ?;`;
  const values = [status, id];

  conn.query(sqlQuery, values, (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: err,
      });
    } else {
      res.status(200).send({
        status: "success",
        msg: "Status Update successful",
      });
    }
  });
};
