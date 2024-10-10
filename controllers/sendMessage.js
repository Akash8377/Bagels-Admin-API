const AppError = require("../utils/appError");
const { validationResult } = require("express-validator");
require("dotenv").config();
const conn = require("../services/db");
const axios = require('axios');
const twilio= require("twilio");


const twilioClient= twilio("AC2884485221260b0523e9b75716fe1a85", "c6e773a78fb140b02e28a6e6b0e393cc");

exports.sendBulkSMS = async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).send({errors: errors.array()});
    }
    const {message} = req.body;
    if(!message){
        return res.status(400).send({msg:"Message is require"});
    }

   

    try{
        const response = await axios.get("http://0.0.0.0:9000/user-phoneno");
        console.log("API Response:", response.data);

        // const mobileNumbers = response.data.data.map(row => row.mobile_number).filter(num => num);

        const mobileNumbers = response.data.data.filter(num => num && num.length > 0);

        if(mobileNumbers.length === 0){
            return res.status(404).send({msg:"No valid phone numbers found"});
        }

       
        // const cleanedMessage = message.replace(/https?:\/\/[^\s]+|www\.[^\s]+/g, '').trim();

        const smsPromises = mobileNumbers.map(number => {
            return twilioClient.messages.create({
                body:message,
                from:"+15312081307",
                to:number,
            })
        })
        await Promise.all(smsPromises)

        //Insert message into the databasee

        const sql = "INSERT INTO messages (message_body, recipient_count, sent_at) VALUES (?, ?, ?)";
        const values = [message, mobileNumbers.length, new Date()];

        conn.query(sql, values, (err, result) => {
            if (err) {
                console.error("Database insertion error:", err);
                return res.status(500).send({ msg: "Failed to record message in the database" });
            }
            console.log("Message record inserted:", result.insertId);
        });
        res.status(200).send({
            status:"success",
            msg:"Message Sent Successfully",
            count: mobileNumbers.length,
        })
    }catch(error){
        console.error("Error message",error)
        if(error.response){
            res.status(error.response.status).send({msg:"Failed to fetch phone number"});
        }else{
            res.status(500).send({msg:"Failed to send message", details: error.message});
        }
    }
}


exports.fetchMessages = (req, res) =>{
    let sqlQuery = "SELECT * FROM messages";

    conn.query(sqlQuery, (err, result) =>{
        if(err){
            return res.status(500).send({msg:err});
        }else{
            res.status(200).send({status:"success", length: result?.length, data:result});
        }
    })
}

exports.deleteMessage = (req, res) => {
    const id = req.params.id;
    let sqlQuery = "DELETE FROM messages WHERE id= ?";
  
    conn.query(sqlQuery, [id], (err, result) => {
        console.log(id)
      if (err) {
        return res.status(500).send({ msg: err });
      } else {
        res.status(200).send({ status: "success", msg: "Message deleted successfully" });
      }
    });
  };
