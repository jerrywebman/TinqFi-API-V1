const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const dbConfig = require("./config/dbconfig");
const passport = require("passport");
require("dotenv").config();
const cookieParser = require("cookie-parser");

connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//routes
//cors allows us to call data/api from cross domains
app.use(
  cors({
    origin: ["https://tinqlab.com", "https://www.tinqlab.com"],
  }),
);
// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  // res.setHeader(
  //   "Access-Control-Allow-Origin",
  //   "http://localhost:5000,http://localhost:2 000 "
  // );

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type",
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

//creating the session store
// const sessionStore = new MongoStore.create({
//   mongoUrl: dbConfig.database,
//   collection: "sessions",
// });

// app.use(cors({ origin: "https://localhost:3000", credentials: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

//get routes
const tinqlab = require("./routes/tinqlab");

app.use(tinqlab);

const PORT = 4001;

app.listen(
  PORT,
  console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`),
);
