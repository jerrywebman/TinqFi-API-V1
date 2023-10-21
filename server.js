const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const dbConfig = require("./config/dbconfig");
const passport = require("passport");
require("dotenv").config();
// const multer = require("multer");
// const path = require("path");
// var Verification = require("./models/verification");
// const verify = require("./verifyToken");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("./middleware/init_redis");

connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//routes
//cors allows us to call data/api from cross domains
app.use(cors({ origin: "*" }));
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
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
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

//storing the session in mongodb
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: dbConfig.database, //the database string
      ttl: 1 * 24 * 60 * 60, //1day
      collectionName: "sessions", //setting the collection name
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
      // secure: true, // Uncomment this line to enforce HTTPS protocol.
      sameSite: true,
    },
  })
);

//GETTING INFO
app.use(passport.initialize());
require("./config/passport")(passport);

//get routes
const routes = require("./routes/index");
const wallet = require("./routes/wallet");
const ledgerTransactions = require("./routes/ledgerTransactions");
const externalData = require("./routes/externalData");
const transaction = require("./routes/transaction");
const notification = require("./routes/notification");
const loan = require("./routes/loan");
const earn = require("./routes/earn");
const withdrawal = require("./routes/withdrawal");
const faq = require("./routes/faq");
const pool = require("./routes/pool");
const response = require("./routes/response");
const convert = require("./routes/convert");
const biometrics = require("./routes/biometrics");
const adverts = require("./routes/adverts");
const referral = require("./routes/referral");
const webhooks = require("./routes/webhooks");
const tokens = require("./routes/tokens");

app.use(routes);
app.use(wallet);
app.use(ledgerTransactions);
app.use(externalData);
app.use(transaction);
app.use(notification);
app.use(loan);
app.use(earn);
app.use(withdrawal);
app.use(pool);
app.use(faq);
app.use(response);
app.use(convert);
app.use(biometrics);
app.use(adverts);
app.use(referral);
app.use(webhooks);
app.use(tokens);

const PORT = process.env.PORT || 4000;

app.listen(
  PORT,
  console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`)
);
