const express = require("express");
const routes = require("./routes/routes");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const errorHandler = require("./utils/errorHandler");
const path = require("path");
require("dotenv").config();  // Load .env variables
const session = require("express-session");
const cors = require("cors");

const app = express();
app.use(
  session({
    secret: "yourSecretKeyHere",
    resave: false,
    saveUninitialized: true,
  })
);
const corsOptions = {
  origin: "*", // Adjust this to allow only your frontend
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.static(path.resolve("./public")));
global.__basedir = __dirname;

app.use(express.json());
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

// Handle non-existent routes
app.all("*", (req, res, next) => {
  next(new AppError(`The URL ${req.originalUrl} does not exist`, 404));
});

// Error handling middleware
app.use(errorHandler);

// const hostname = process.env.HOST || "127.0.0.1";
const hostname = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 9000;

app.listen(port, hostname, () => {
  console.log(`Server running on http://${hostname}:${port}`);
});

module.exports = app;
