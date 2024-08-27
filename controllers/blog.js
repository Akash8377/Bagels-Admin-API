const AppError = require("../utils/appError");
const { validationResult } = require("express-validator");
require("dotenv").config();
const slugify = require("slugify");
const conn = require("../services/db");

exports.getblog = (req, res) => {
  let sqlQuery = "SELECT * FROM blog";

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

// add blog
exports.addblog = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  conn.query(
    `SELECT * FROM blog WHERE(name) = LOWER(${conn.escape(
      req.body.name
    )});`,
    (err, result) => {
      if (result && result.length) {
        return res.status(409).send({
          msg: "This blog already exists",
        });
      } else {
        // Generate slug from the title using slugify
        const slug = slugify(req.body.name, {
          replacement: "-", // replace spaces with -
          lower: true, // convert to lowercase
          remove: /[*+~.()'"!:@#?$&]/g, // remove special characters
        });
        var date_time = new Date();
        const sqlQuery = `INSERT INTO blog (parent_id, name, slug, image, short_description,description,meta_title,meta_description,meta_keywords,created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
        const values = [
          req.body.parent_id,
          req.body.name,
          slug,
          req.body.image,
          req.body.short_description,
          req.body.description,
          req.body.meta_title,
          req.body.meta_description,
          req.body.meta_keywords,
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
              msg: "Blog Register successful",
            });
          }
        });
      }
    }
  );
};

exports.editblog = (req, res) => {
  let sqlQuery = "SELECT * FROM blog WHERE id=" + req.params.id;
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
exports.updateblog = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Generate slug from the title using slugify
  const slug = slugify(req.body.name, {
    replacement: "-", // replace spaces with -
    lower: true, // convert to lowercase
    remove: /[*+~.()'"!:@#?$&]/g, // remove special characters
  });
  var date_time = new Date();
  const sqlQuery = `UPDATE blog SET parent_id = ?,name = ?,slug = ?, image =?,short_description = ?,description = ?,meta_title = ?,meta_description = ?,meta_keywords = ?,updated_at=? WHERE id = ?;`;
  const values = [
    req.body.parent_id,
    req.body.name,
    slug,
    req.body.image,
    req.body.short_description,
    req.body.description,
    req.body.meta_title,
    req.body.meta_description,
    req.body.meta_keywords,
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
        msg: "Blog update successful",
      });
    }
  });
};

exports.deleteblog = (req, res) => {
  let sqlQuery = "DELETE FROM blog WHERE id=" + req.params.id + "";

  conn.query(sqlQuery, (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: err,
      });
    } else {
      res.status(200).send({
        status: "success",
        msg: "Blog delete successful",
      });
    }
  });
};

exports.status = (req, res) => {
  const status = req.body.status; // This should be "active" or "inactive"
  const id = req.params.id;
  const sqlQuery = `UPDATE blog SET status = ? WHERE id = ?;`;
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
