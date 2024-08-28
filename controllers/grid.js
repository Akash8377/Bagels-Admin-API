const { validationResult } = require("express-validator");
const conn = require("../services/db");

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
      w.id AS week_id,
      w.week_name,
      w.spread,
      o.id AS opponent_id,
      o.name AS opponent_name
    FROM
      grid g
    LEFT JOIN
      week w ON FIND_IN_SET(w.id, g.week_id)
    LEFT JOIN
      week_opponents wo ON w.id = wo.week_id
    LEFT JOIN
      opponents o ON wo.opponent_id = o.id
    GROUP BY
      g.id, w.id, o.id;
  `;
  
  conn.query(query, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send({
        msg: "Internal Server Error",
      });
    } else {
      const grid = results.reduce((acc, row) => {
        const existingGridItem = acc.find(item => item.id === row.id);
        const weekInfo = {
          id: row.week_id,
          name: row.week_name,
          spread: row.spread,
        };
        const opponentInfo = {
          id: row.opponent_id,
          name: row.opponent_name,
        };

        if (existingGridItem) {
          const existingWeek = existingGridItem.weeks.find(w => w.id === row.week_id);
          if (existingWeek) {
            if (opponentInfo.id) {
              existingWeek.opponents.push(opponentInfo);
            }
          } else {
            existingGridItem.weeks.push({
              ...weekInfo,
              opponents: opponentInfo.id ? [opponentInfo] : [],
            });
          }
        } else {
          acc.push({
            id: row.id,
            expected_value: row.expected_value,
            win_percentage: row.win_percentage,
            major_percentage: row.major_percentage,
            team: row.team,
            future: row.future,
            status: row.status,
            weeks: [{
              ...weekInfo,
              opponents: opponentInfo.id ? [opponentInfo] : [],
            }],
          });
        }

        return acc;
      }, []);

      res.status(200).send({
        status: "success",
        length: grid.length,
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

  let inputArray = req.body.week_id;

  if (!Array.isArray(inputArray)) {
    inputArray = [inputArray];
  }

  const commaSeparatedString = inputArray.join(",");
  const date_time = new Date();

  conn.query(
    `SELECT * FROM grid WHERE LOWER(team) = LOWER(${conn.escape(req.body.team)});`,
    (err, result) => {
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
              msg: err,
            });
          } else {
            res.status(200).send({
              status: "success",
              msg: "Grid item registration successful",
            });
          }
        });
      }
    }
  );
};

exports.edit = (req, res) => {
  let sqlQuery = "SELECT * FROM grid WHERE id=" + req.params.id;
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
        msg: err,
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
  const sqlQuery = `UPDATE grid SET status = ? WHERE id = ?;`;

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
