const AppError = require("../utils/appError");
const { validationResult } = require("express-validator");
require("dotenv").config();
const conn = require("../services/db");

exports.get = (req, res) => {
  let sqlQuery = "SELECT * FROM  user_mail";

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

exports.delete = (req, res) => {
    let sqlQuery = "DELETE FROM user_mail WHERE id=" + req.params.id + "";
  
    conn.query(sqlQuery, (err, result) => {
      if (err) {
        return res.status(500).send({
          msg: err,
        });
      } else {
        res.status(200).send({
          status: "success",
          msg: "User Mail delete successful",
        });
      }
    });
  };