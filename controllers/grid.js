const AppError = require("../utils/appError");
const { validationResult } = require("express-validator");
require("dotenv").config();
const conn = require("../services/db");

exports.get = (req, res) => {
  let query = `
    SELECT
      h.id,
      h.stateFee_name,
      h.stateFee_fee,
      h.entity_id as entityId,  
      h.status,
      GROUP_CONCAT(l.entity_name) AS entity,
      GROUP_CONCAT(l.id) AS entityIds
    FROM
      stateFees h
    LEFT JOIN
      entity l ON FIND_IN_SET(l.id, h.entity_id)
    GROUP BY
      h.id, h.stateFee_name, h.stateFee_fee, h.status;
  `;
  
  conn.query(query, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send({
        msg: "Internal Server Error",
      });
    } else {
      const stateFees = results.map((row) => ({
        id: row.id,
        stateFee_name: row.stateFee_name,
        stateFee_fee: row.stateFee_fee,
        status: row.status,
        entity_id: row.entityId,
        entity: row.entity,
        entity_info: row.entityIds
          ? row.entityIds.split(",").map((entityId, index) => ({
              id: entityId,
              name: row.entity.split(",")[index],
            }))
          : [],
      }));

      res.status(200).send({
        status: "success",
        length: results.length,
        data: stateFees,
      });
    }
  });
};

exports.register = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  conn.query(
    `SELECT * FROM stateFees WHERE (stateFee_name) = LOWER(${conn.escape(
      req.body.stateFee_name
    )});`,
    (err, result) => {
      if (result && result.length) {
        return res.status(409).send({
          msg: "This StateFee already exists",
        });
      } else {
        const inputArray = req.body.entity_id; // Assuming entity_id is an array
        const commaSeparatedString = (newStr = String(inputArray));
        var date_time = new Date();
        const sqlQuery = `INSERT INTO stateFees (entity_id,stateFee_name,stateFee_fee,created_at, updated_at) VALUES (?, ?, ?, ?,?)`;
        const values = [
          commaSeparatedString,
          req.body.stateFee_name,
          req.body.stateFee_fee,
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
              msg: "StateFee Register successful",
            });
          }
        });
      }
    }
  );
};


exports.edit = (req, res) => {
  let sqlQuery = "SELECT * FROM stateFees WHERE id=" + req.params.id;
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
  
  const inputArray = req.body.entity_id; // Assuming entity_id is an array
  const commaSeparatedString = inputArray.join(",");
  const date_time = new Date();
  
  const sqlQuery = `UPDATE stateFees SET stateFee_name = ?, stateFee_fee = ?, entity_id = ?, updated_at = ? WHERE id = ?`;
  const values = [
    req.body.stateFee_name,
    req.body.stateFee_fee,
    commaSeparatedString,
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
        msg: "StateFee update successful",
      });
    }
  });
};



exports.delete = (req, res) => {
  let sqlQuery = "DELETE FROM stateFees WHERE id=" + req.params.id + "";

  conn.query(sqlQuery, (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: err,
      });
    } else {
      res.status(200).send({
        status: "success",
        msg: "StateFees delete successful",
      });
    }
  });
};

exports.status = (req, res) => {
  const status = req.body.status; // This should be "active" or "inactive"
  const id = req.params.id;
  const sqlQuery = `UPDATE stateFees SET status = ? WHERE id = ?;`;
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
