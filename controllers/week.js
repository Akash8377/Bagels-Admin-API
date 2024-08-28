const { validationResult } = require("express-validator");
require("dotenv").config();
const conn = require("../services/db");

// Table names
const GRID_TABLE = "grid";
const WEEK_TABLE = "week";
const OPPONENT_TABLE = "opponent";

// Get all grid items with associated week and opponent data
exports.get = (req, res) => {
  let query = `
    SELECT
      g.id,
      g.expected_value,
      g.win_percentage,
      g.major_percentage,
      g.team,
      g.future,
      g.status,
      GROUP_CONCAT(w.id) AS weekIds,
      GROUP_CONCAT(w.week_name) AS weekNames,
      GROUP_CONCAT(o.id) AS opponentIds,
      GROUP_CONCAT(o.opponent_name) AS opponentNames,
      GROUP_CONCAT(w.spread) AS spreads,
      GROUP_CONCAT(w.status) AS weekStatuses
    FROM
      ${GRID_TABLE} g
    LEFT JOIN
      ${WEEK_TABLE} w ON FIND_IN_SET(w.id, g.week_id)
    LEFT JOIN
      ${OPPONENT_TABLE} o ON o.id = w.opponent_id
    GROUP BY
      g.id
  `;

  conn.query(query, (err, results) => {
    if (err) {
      return res.status(500).send({
        msg: "Internal Server Error",
      });
    }

    const grid = results.map((row) => ({
      id: row.id,
      expected_value: row.expected_value,
      win_percentage: row.win_percentage,
      major_percentage: row.major_percentage,
      team: row.team,
      future: row.future,
      status: row.status,
      week_info: row.weekIds
        ? row.weekIds.split(",").map((weekId, index) => ({
            week_id: weekId,
            week_name: row.weekNames.split(",")[index],
            opponent_id: row.opponentIds.split(",")[index],
            opponent_name: row.opponentNames.split(",")[index],
            spread: row.spreads.split(",")[index],
            status: row.weekStatuses.split(",")[index],
          }))
        : [],
    }));

    res.status(200).send({
      status: "success",
      length: grid.length,
      data: grid,
    });
  });
};

// Register a new grid item with associated week info
exports.register = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const date_time = new Date();
  const weekInfo = req.body["week-info"];
  const commaSeparatedWeekIds = weekInfo.map((week) => week.week_id).join(",");

  const sqlCheckQuery = `SELECT * FROM ${GRID_TABLE} WHERE LOWER(team) = LOWER(${conn.escape(req.body.team)});`;

  conn.query(sqlCheckQuery, (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: "Internal Server Error",
      });
    }

    if (result.length > 0) {
      return res.status(409).send({
        msg: "This grid item already exists",
      });
    }

    const sqlQuery = `
      INSERT INTO ${GRID_TABLE} 
      (expected_value, win_percentage, major_percentage, team, future, week_id, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      req.body.expected_value,
      req.body.win_percentage,
      req.body.major_percentage,
      req.body.team,
      req.body.future,
      commaSeparatedWeekIds,
      req.body.status,
      date_time,
      date_time,
    ];

    conn.query(sqlQuery, values, (err) => {
      if (err) {
        return res.status(500).send({
          msg: "Internal Server Error",
        });
      }

      res.status(200).send({
        status: "success",
        msg: "Grid item registered successfully",
      });
    });
  });
};

// Edit a grid item
exports.edit = (req, res) => {
  const sqlQuery = `SELECT * FROM ${GRID_TABLE} WHERE id = ?`;

  conn.query(sqlQuery, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: "Internal Server Error",
      });
    }

    res.status(200).send({
      status: "success",
      length: result.length,
      data: result,
    });
  });
};

// Update an existing grid item
exports.update = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const date_time = new Date();
  const weekInfo = req.body["week-info"];
  const commaSeparatedWeekIds = weekInfo.map((week) => week.week_id).join(",");

  const sqlQuery = `
    UPDATE ${GRID_TABLE}
    SET expected_value = ?, win_percentage = ?, major_percentage = ?, team = ?, future = ?, week_id = ?, status = ?, updated_at = ?
    WHERE id = ?
  `;
  const values = [
    req.body.expected_value,
    req.body.win_percentage,
    req.body.major_percentage,
    req.body.team,
    req.body.future,
    commaSeparatedWeekIds,
    req.body.status,
    date_time,
    req.params.id,
  ];

  conn.query(sqlQuery, values, (err) => {
    if (err) {
      return res.status(500).send({
        msg: "Internal Server Error",
      });
    }

    res.status(200).send({
      status: "success",
      msg: "Grid item updated successfully",
    });
  });
};

// Delete a grid item
exports.delete = (req, res) => {
  const sqlQuery = `DELETE FROM ${GRID_TABLE} WHERE id = ?`;

  conn.query(sqlQuery, [req.params.id], (err) => {
    if (err) {
      return res.status(500).send({
        msg: "Internal Server Error",
      });
    }

    res.status(200).send({
      status: "success",
      msg: "Grid item deleted successfully",
    });
  });
};

// Update the status of a grid item
exports.status = (req, res) => {
  const status = req.body.status; // Should be "active" or "inactive"
  const id = req.params.id;
  const sqlQuery = `UPDATE ${GRID_TABLE} SET status = ? WHERE id = ?`;

  conn.query(sqlQuery, [status, id], (err) => {
    if (err) {
      return res.status(500).send({
        msg: "Internal Server Error",
      });
    }

    res.status(200).send({
      status: "success",
      msg: "Grid item status updated successfully",
    });
  });
};
