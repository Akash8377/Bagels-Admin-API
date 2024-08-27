const AppError = require("../utils/appError");
const { validationResult } = require("express-validator");
require("dotenv").config();

const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "./public/data/uploads/" });
const conn = require("../services/db");

// add category upload file
exports.uploadcatimage =
  (upload.single("image"),
  (req, res) => {
    console.log("sdjgjsdgj");
    const imageName = req.file.filename;
    console.log(imageName);
    res.send({ imageName });
  });
// add Emirates upload file
exports.uploadEmiratesimage =
  (upload.single("image"),
  (req, res) => {
    console.log("uploademiimage");
    const imageName = req.file.filename;
    console.log(imageName);
    res.send({ imageName });
  });
