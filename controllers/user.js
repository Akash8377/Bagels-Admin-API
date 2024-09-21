const AppError = require("../utils/appError");
const { validationResult } = require("express-validator");
require("dotenv").config();
const conn = require("../services/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const token_key = process.env.TOKEN_KEY;

// Login function User login

exports.getUserLogin = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  conn.query(
    `SELECT * FROM admin WHERE email = ${conn.escape(req.body.email)}`,
    (err, result) => {
      if (err) {
        return res.status(400).send({
          msg: err,
        });
      }
      if (!result.length) {
        return res.status(400).send({
          msg: "Email or Password is incorrect!",
        });
      }
      bcrypt.compare(
        req.body.password,
        result[0]["password"],
        (bErr, bresult) => {
          if (bErr) {
            return res.status(400).send({
              msg: bErr,
            });
          }
          if (bresult) {
            const token = jwt.sign(
              { id: result[0]["id"], is_admin: result[0]["is_admin"] },
              token_key,
              { expiresIn: "1h" }
            );
            conn.query(
              `UPDATE admin SET last_login = NOW() WHERE id = ${result[0]["id"]}`
            );
            res.status(200).send({
              status: "success",
              token,
              length: result?.length,
              data: result,
            });
          } else {
            return res.status(400).send({
              msg: "Email or Password is incorrect!",
            });
          }
        }
      );
    }
  );
};

// Get login User Profile

exports.welcome = (req, res) => {
  const authToken = req.headers.authorization.split(" ")[1];
  const decode = jwt.verify(authToken, token_key);
  conn.query(
    `SELECT * FROM admin where id =?`,
    decode.id,
    function (error, result, field) {
      if (error) throw error;
      return res.status(200).send({
        succes: true,
        data: result[0],
        msg: "Fetch Successfully!",
      });
    }
  );
};

// Logout Function

exports.logout = (req, res) => {
  const tokenBlacklist = new Set();
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(400).send({ message: "Token is required for logout" });
  }

  // Add the token to the list of revoked tokens

  tokenBlacklist.add(token);

  res.status(200).send({ message: "Logged out successfully" });
};

exports.get_all_user = (req, res) => {
  let sqlQuery = "SELECT * FROM users";

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
