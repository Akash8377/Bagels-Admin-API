const { validationResult } = require("express-validator");
require("dotenv").config();
const conn = require("../services/db");

// Table names
const WEEK_TABLE = "opponent";

exports.get = (req, res) => {
  const sqlQuery = `SELECT * FROM ${WEEK_TABLE}`;

  conn.query(sqlQuery, (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: "Internal Server Error",
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

exports.register = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const opponentName = req.body.opponent_name.toLowerCase();
  const sqlCheckQuery = `SELECT * FROM ${WEEK_TABLE} WHERE LOWER(opponent_name) = ?`;

  conn.query(sqlCheckQuery, [opponentName], (err, result) => {
    if (err) {
      console.error('SQL Error:', err); // Log the actual SQL error
      return res.status(500).send({
        msg: "Internal Server Error",
      });
    }

    if (result && result.length) {
      return res.status(409).send({
        msg: "This Opponent already exists",
      });
    } else {
      const date_time = new Date();
      const sqlQuery = `INSERT INTO ${WEEK_TABLE} (opponent_name, created_at, updated_at) VALUES (?, ?, ?)`;
      const values = [
        req.body.opponent_name,
        date_time,
        date_time
      ];

      conn.query(sqlQuery, values, (err, result) => {
        if (err) {
          console.error('SQL Error:', err); // Log the actual SQL error
          return res.status(500).send({
            msg: "Internal Server Error",
          });
        } else {
          res.status(200).send({
            status: "success",
            msg: "Opponent registered successfully",
          });
        }
      });
    }
  });
};


exports.edit = (req, res) => {
  const sqlQuery = `SELECT * FROM ${WEEK_TABLE} WHERE id = ?`;

  conn.query(sqlQuery, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: "Internal Server Error",
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

  const date_time = new Date();
  const sqlQuery = `
    UPDATE ${WEEK_TABLE}
    SET opponent_name = ?, updated_at = ?
    WHERE id = ?
  `;
  const values = [
    req.body.opponent_name,
    date_time,
    req.params.id,
  ];

  conn.query(sqlQuery, values, (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: "Internal Server Error",
      });
    } else {
      res.status(200).send({
        status: "success",
        msg: "Week update successful",
      });
    }
  });
};

exports.delete = (req, res) => {
  const sqlQuery = `DELETE FROM ${WEEK_TABLE} WHERE id = ?`;

  conn.query(sqlQuery, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: "Internal Server Error",
      });
    } else {
      res.status(200).send({
        status: "success",
        msg: "Week delete successful",
      });
    }
  });
};

exports.status = (req, res) => {
  const status = req.body.status; // This should be "active" or "inactive"
  const id = req.params.id;
  const sqlQuery = `UPDATE ${WEEK_TABLE} SET status = ? WHERE id = ?`;
  const values = [status, id];

  conn.query(sqlQuery, values, (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: "Internal Server Error",
      });
    } else {
      res.status(200).send({
        status: "success",
        msg: "Status Update successful",
      });
    }
  });
};
