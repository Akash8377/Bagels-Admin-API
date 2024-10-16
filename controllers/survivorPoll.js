const AppError = require("../utils/appError");
const { validationResult } = require("express-validator");
require("dotenv").config();
const conn = require("../services/db");


    

exports.get = (req, res) =>{
    let sqlQuery = "SELECT * FROM user_selections";

    conn.query(sqlQuery, (err, result) =>{
        if(err){
            return res.status(500).send({msg:err});
        }else{
            res.status(200).send({status:"success", length: result?.length, data:result});
        }
    })
}

 exports.updateTeamResult = (req, res) => {
    const { selected_team, week_id } = req.params;
    const { result } = req.body;
  
    const sqlQuery = `
    UPDATE user_selections SET result = ?
    WHERE selected_team = ? AND week_id = ?`
  
    conn.query(sqlQuery, [result, selected_team, week_id], (err, updateResult) => {
      if (err) {
        return res.status(500).send({ msg: err });
      }
  
      if (updateResult.affectedRows === 0) {
        return res.status(404).send({ msg: "Team not found or no entries to update." });
      }
  
      res.status(200).send({ status: "success", msg: "Result updated successfully for all users of the team." });
    });
  };

