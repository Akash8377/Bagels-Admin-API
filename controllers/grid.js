const { validationResult } = require("express-validator");
require("dotenv").config();
const conn = require("../services/db");

exports.get = (req, res) => {
  let sqlQuery = `
    SELECT 
      g.id, 
      g.expected_value, 
      g.win_percentage, 
      g.major_percentage, 
      g.team, 
      g.future, 
      g.status, 
      w.id AS week_id, 
      w.week_name, 
      w.opponent_id, 
      w.opponent_name, 
      w.spread, 
      w.status AS week_status
    FROM grid g
    LEFT JOIN week_info w ON g.id = w.grid_id
  `;

  conn.query(sqlQuery, (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: err,
      });
    } else {
      // Group the results by grid
      const groupedResult = result.reduce((acc, row) => {
        if (!acc[row.id]) {
          acc[row.id] = {
            id: row.id,
            expected_value: row.expected_value,
            win_percentage: row.win_percentage,
            major_percentage: row.major_percentage,
            team: row.team,
            future: row.future,
            status: row.status,
            week_info: [],
          };
        }
        if (row.week_id) {
          acc[row.id].week_info.push({
            week_id: row.week_id,
            week_name: row.week_name,
            opponent_id: row.opponent_id,
            opponent_name: row.opponent_name,
            spread: row.spread,
            status: row.week_status,
          });
        }
        return acc;
      }, {});

      const finalResult = Object.values(groupedResult);

      res.status(200).send({
        status: "success",
        length: finalResult.length,
        data: finalResult,
      });
    }
  });
};

exports.register = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { expected_value, win_percentage, major_percentage, team, future, 'week-info': weekInfo } = req.body;

  console.log("Request body:", req.body); // Debugging log

  // Check if the grid record already exists
  const checkGridQuery = `SELECT * FROM grid WHERE team = LOWER(${conn.escape(team)});`;
  conn.query(checkGridQuery, (err, result) => {
    if (err) {
      return res.status(500).send({ msg: err });
    }

    if (result.length) {
      return res.status(409).send({ msg: "This Grid already exists" });
    } else {
      const date_time = new Date();
      const sqlQuery = `INSERT INTO grid (expected_value, win_percentage, major_percentage, team, future, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const values = [expected_value, win_percentage, major_percentage, team, future, date_time, date_time];

      conn.query(sqlQuery, values, (err, result) => {
        if (err) {
          return res.status(500).send({ msg: err });
        }

        const gridId = result.insertId;

        // Ensure week_info is defined and is an array
        if (Array.isArray(weekInfo)) {
          const weeksQuery = `INSERT INTO week_info (grid_id, week_id, week_name, opponent_id, opponent_name, spread, status) VALUES ?`;
          const weeksValues = weekInfo.map((week) => [
            gridId,
            week.week_id,
            week.week_name,
            week.opponent_id,
            week.opponent_name,
            week.spread,
            week.status
          ]);

          conn.query(weeksQuery, [weeksValues], (err) => {
            if (err) {
              return res.status(500).send({ msg: err });
            }

            res.status(200).send({
              status: "success",
              msg: "Grid and week info registered successfully",
            });
          });
        } else {
          // Handle case where week_info is not provided or not an array
          res.status(400).send({
            status: "error",
            msg: "Invalid week_info data",
          });
        }
      });
    }
  });
};


exports.edit = (req, res) => {
  const sqlQuery = `
    SELECT g.*, w.id AS week_id, w.week_name, w.opponent_id, w.opponent_name, w.spread, w.status AS week_status
    FROM grid g
    LEFT JOIN week_info w ON g.id = w.grid_id
    WHERE g.id = ?`;

  conn.query(sqlQuery, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).send({
        msg: err,
      });
    }

    if (results.length === 0) {
      return res.status(404).send({
        status: "error",
        msg: "Grid not found",
      });
    }

    const grid = {
      id: results[0].id,
      expected_value: results[0].expected_value,
      win_percentage: results[0].win_percentage,
      major_percentage: results[0].major_percentage,
      team: results[0].team,
      future: results[0].future,
      status: results[0].status,
      week_info: results.map(row => ({
        week_id: row.week_id,
        week_name: row.week_name,
        opponent_id: row.opponent_id,
        opponent_name: row.opponent_name,
        spread: row.spread,
        status: row.week_status,
      })),
    };

    res.status(200).send({
      status: "success",
      data: grid,
    });
  });
};


exports.update = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const date_time = new Date();
  const { expected_value, win_percentage, major_percentage, team, future, status, 'week-info': weekInfo } = req.body;

  // Update grid table
  const updateGridQuery = `UPDATE grid SET expected_value = ?, win_percentage = ?, major_percentage = ?, team = ?, future = ?, status = ?, updated_at = ? WHERE id = ?`;
  const gridValues = [
    expected_value,
    win_percentage,
    major_percentage,
    team,
    future,
    status,
    date_time,
    req.params.id,
  ];

  conn.query(updateGridQuery, gridValues, (gridErr) => {
    if (gridErr) {
      return res.status(500).send({
        msg: "Internal Server Error",
      });
    }

    // First, delete all existing week_info records for this grid
    const deleteWeekInfoQuery = `DELETE FROM week_info WHERE grid_id = ?`;
    conn.query(deleteWeekInfoQuery, [req.params.id], (deleteErr) => {
      if (deleteErr) {
        return res.status(500).send({ msg: deleteErr });
      }

      // Insert new week_info records
      if (Array.isArray(weekInfo)) {
        const insertWeekInfoQuery = `INSERT INTO week_info (grid_id, week_id, week_name, opponent_id, opponent_name, spread, status) VALUES ?`;
        const weeksValues = weekInfo.map((week) => [
          req.params.id,
          week.week_id,
          week.week_name,
          week.opponent_id,
          week.opponent_name,
          week.spread,
          week.status,
        ]);

        conn.query(insertWeekInfoQuery, [weeksValues], (insertErr) => {
          if (insertErr) {
            return res.status(500).send({ msg: insertErr });
          }

          res.status(200).send({
            status: "success",
            msg: "Grid and Week Info updated successfully",
          });
        });
      } else {
        // Handle case where week_info is not an array
        res.status(400).send({
          status: "error",
          msg: "Invalid week_info data",
        });
      }
    });
  });
};


exports.delete = (req, res) => {
  const gridId = req.params.id;

  // Delete from week_info table first
  const deleteWeekInfoQuery = "DELETE FROM week_info WHERE grid_id = ?";
  conn.query(deleteWeekInfoQuery, [gridId], (weekInfoErr, weekInfoResult) => {
    if (weekInfoErr) {
      return res.status(500).send({
        msg: weekInfoErr,
      });
    }

    // Then delete from grid table
    const deleteGridQuery = "DELETE FROM grid WHERE id = ?";
    conn.query(deleteGridQuery, [gridId], (gridErr, gridResult) => {
      if (gridErr) {
        return res.status(500).send({
          msg: gridErr,
        });
      }

      res.status(200).send({
        status: "success",
        msg: "Grid and associated Week Info deleted successfully",
      });
    });
  });
};


exports.status = (req, res) => {
  const status = req.body.status; // This should be "active" or "inactive"
  const id = req.params.id;
  const sqlQuery = `UPDATE grid SET status = ? WHERE id = ?;`;
  const values = [status, id];

  conn.query(sqlQuery, values, (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: err,
      });
    } else {
      res.status(200).send({
        status: "success",
        msg: "Status updated successfully",
      });
    }
  });
};

