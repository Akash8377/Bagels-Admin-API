
const AppError = require("../utils/appError");
const { validationResult } = require("express-validator");
require("dotenv").config();
const conn = require("../services/db");
const { default: slugify } = require("slugify");
const { remove } = require("./file.controller");


exports.get = (req, res) =>{
    let sqlQuery = "SELECT * FROM promocodes";

    conn.query(sqlQuery, (err, result) =>{
        if(err){
            return res.status(500).send({msg:err});
        }else{
            res.status(200).send({status:"success", length: result?.length, data:result});
        }
    })
}

exports.create = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, discount, status } = req.body;

    var date_time = new Date();
    const sqlQuery = `INSERT INTO promocodes (code, discount, status, create_at, update_at) VALUES (?, ?, ?, ?, ?)`;
    const values = [
      code, 
      discount, 
      status, 
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
          msg: "Promocode created successfully",
        });
      }
    });
};


exports.edit = (req, res) =>{
    let sqlQuery = "SELECT * FROM promocodes WHERE id=" + req.params.id;

    conn.query(sqlQuery,(err, result) => {
        if(err){
            return res.status(500).send({msg:err});
        }else{
            res.status(200).send({status:"success", length:result?.length, data:result})
        }
    });
}

// Update promocode
exports.update = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { code, discount, status } = req.body;
    const date_time = new Date();
   

    const sqlQuery = `UPDATE promocodes SET code=?, discount=?, status=?, update_at=? WHERE id = ?`;
    const values = [code, discount, status, date_time, req.params.id];
  
    conn.query(sqlQuery, values, (err, result) => {
      if (err) {
        console.log("database error", err);
        return res.status(500).send({ msg: err });
      } else {
        res.status(200).send({ status: "success", msg: "Promocode updated successfully" });
      }
    });
  };
  
  // Delete promocode
  exports.delete = (req, res) => {
    const id = req.params.id;
    let sqlQuery = "DELETE FROM promocodes WHERE id= ?";
  
    conn.query(sqlQuery, [id], (err, result) => {
        console.log(id)
      if (err) {
        return res.status(500).send({ msg: err });
      } else {
        res.status(200).send({ status: "success", msg: "Promocode deleted successfully" });
      }
    });
  };
  
  // Update promocode status
  exports.status = (req, res) => {
    const status = req.body.status; // "active" or "inactive"
    const id = req.params.id;
    const sqlQuery = `UPDATE promocodes SET status = ? WHERE id = ?;`;
    const values = [status, id];
  
    conn.query(sqlQuery, values, (err, result) => {
      if (err) {
        return res.status(500).send({ msg: err });
      } else {
        res.status(200).send({ status: "success", msg: "Promocode status updated successfully" });
      }
    });
  };