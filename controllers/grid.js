const { validationResult } = require("express-validator");
require("dotenv").config();
const conn = require("../services/db");

exports.get = (req, res) => {
  let query = `
    SELECT
      h.id,
      h.expected_value,
      h.win_percentage,
      h.major_percentage,
      h.team,
      h.future,
      h.week_id as weekId,
      h.status,
      GROUP_CONCAT(l.week_name) AS week,
      GROUP_CONCAT(l.id) AS weekIds
    FROM
      grid h
    LEFT JOIN
      week l ON FIND_IN_SET(l.id, h.week_id)
    GROUP BY
      h.id, h.expected_value, h.win_percentage, h.major_percentage, h.team, h.future;
  `;
  
  conn.query(query, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send({
        msg: "Internal Server Error",
      });
    } else {
      const grid = results.map((row) => ({
        id: row.id,
        expected_value: row.expected_value,
        win_percentage: row.win_percentage,
        major_percentage: row.major_percentage,
        team: row.team,
        future: row.future,
        status: row.status,
        week_id: row.weekId,
        week: row.week,
        week_info: row.weekIds
          ? row.weekIds.split(",").map((weekId, index) => ({
              id: weekId,
              name: row.week.split(",")[index],
            }))
          : [],
      }));

      res.status(200).send({
        status: "success",
        length: results.length,
        data: grid,
      });
    }
  });
};

exports.register = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const inputArray = req.body.week_id; // Assuming week_id is an array
  const commaSeparatedString = inputArray.join(",");
  const date_time = new Date();

  const sqlCheckQuery = `SELECT * FROM grid WHERE LOWER(team) = LOWER(${conn.escape(req.body.team)});`;

  conn.query(sqlCheckQuery, (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: "Internal Server Error",
      });
    }

    if (result && result.length) {
      return res.status(409).send({
        msg: "This grid item already exists",
      });
    } else {
      const sqlQuery = `
        INSERT INTO grid (expected_value, win_percentage, major_percentage, team, future, week_id, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        req.body.expected_value,
        req.body.win_percentage,
        req.body.major_percentage,
        req.body.team,
        req.body.future,
        commaSeparatedString,
        req.body.status,
        date_time,
        date_time,
      ];
      
      conn.query(sqlQuery, values, (err, result) => {
        if (err) {
          return res.status(500).send({
            msg: err.message,
          });
        } else {
          res.status(200).send({
            status: "success",
            msg: "Grid item registration successful",
          });
        }
      });
    }
  });
};

exports.edit = (req, res) => {
  const sqlQuery = `SELECT * FROM grid WHERE id = ?`;

  conn.query(sqlQuery, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: err.message,
      });
    } else {
      res.status(200).send({
        status: "success",
        length: result.length,
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

  const inputArray = req.body.week_id;
  const commaSeparatedString = inputArray.join(",");
  const date_time = new Date();

  const sqlQuery = `
    UPDATE grid 
    SET expected_value = ?, win_percentage = ?, major_percentage = ?, team = ?, future = ?, week_id = ?, status = ?, updated_at = ? 
    WHERE id = ?
  `;
  const values = [
    req.body.expected_value,
    req.body.win_percentage,
    req.body.major_percentage,
    req.body.team,
    req.body.future,
    commaSeparatedString,
    req.body.status,
    date_time,
    req.params.id,
  ];

  conn.query(sqlQuery, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({
        msg: "Internal Server Error",
      });
    } else {
      res.status(200).send({
        status: "success",
        msg: "Grid item update successful",
      });
    }
  });
};

exports.delete = (req, res) => {
  const sqlQuery = "DELETE FROM grid WHERE id = ?";

  conn.query(sqlQuery, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: err.message,
      });
    } else {
      res.status(200).send({
        status: "success",
        msg: "Grid item deletion successful",
      });
    }
  });
};

exports.status = (req, res) => {
  const status = req.body.status; // Should be "active" or "inactive"
  const id = req.params.id;
  const sqlQuery = `UPDATE grid SET status = ? WHERE id = ?`;

  conn.query(sqlQuery, [status, id], (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: "Internal Server Error",
      });
    } else {
      res.status(200).send({
        status: "success",
        msg: "Grid item status update successful",
      });
    }
  });
};
