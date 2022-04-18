// Patches
const { inject, errorHandler } = require("express-custom-error");
inject(); // Patch express in order to use async / await syntax

// Require Dependencies

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const google = require("./googleCalendar/index");
const logger = require("./util/logger");
const { sequelize } = require("./models");

// Load .env Enviroment Variables to process.env

require("mandatoryenv").load([
  //   "DB_HOST",
  //   "DB_DATABASE",
  //   "DB_USER",
  //   "DB_PASSWORD",
  "PORT",
  "SECRET",
]);

const { PORT } = process.env;

// Instantiate an Express Application
const app = express();

// Configure Express App Instance
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Configure custom logger middleware
app.use(logger.dev, logger.combined);

app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: [
      "Access-Control-Allow-Origin",
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    credentials: true,
  })
);
app.use(helmet());

// This middleware adds the json header to every response
app.use("*", (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

// Assign Routes

app.use("/", require("./routes/router.js"));

// Handle errors
app.use(errorHandler());

// Handle not valid route
app.use("*", (req, res) => {
  res.status(404).json({ status: false, message: "Endpoint Not Found" });
});

const assertDatabaseConnection = async () => {
  console.log("Checking database connection...");
  try {
    // await sequelize.sync({ force: true });

    await sequelize.authenticate();
    await google
      .synchronise()
      .then(console.log("Database connection successful !"));
  } catch (error) {
    console.log("Unable to connect to the database");
    console.log(error.message);
    process.exit(1);
  }
};

const init = async () => {
  await assertDatabaseConnection();

  app.listen(PORT, () => {
    console.info("Server listening on port ", PORT);
  });
};

init();
