const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const dbConfig = require("./config/dbconfig");
const passport = require("passport");
// const multer = require("multer");
// const path = require("path");
// var Verification = require("./models/verification");
// const verify = require("./verifyToken");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

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
// const userroutes = require("./routes/user");

app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// FILE UPLOAD STARTS
// ****************************************************

// function errHandler(err, req, res, next) {
//   if (err instanceof multer.MulterError) {
//     res.json({
//       success: 0,
//       message: err.message,
//     });
//   }
// }
// app.use(errHandler);

// const storage = multer.diskStorage({
//   destination: "./upload/images",
//   filename: (req, file, cb) => {
//     return cb(
//       null,
//       `${req.user.email}_${Date.now()}${path.extname(file.originalname)}`
//     );
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 21000000,
//   },
// });
// app.use("/profile", express.static("upload/images"));
// app.use("/profile", express.static("upload/images/govtid"));

// app.post(
//   "/api/upload/selfie",
//   verify,
//   upload.single("profiles"),
//   (req, res) => {
//     var newVerification = Verification({
//       userEmail: req.user.email,
//       userFullname: req.user.fullname,
//       selfieUrl: `https://comiblock.herokuapp.com/profile/${req.file.filename}`,
//     });
//     newVerification.save(function (err, Verification) {
//       if (err) {
//         res.json({
//           success: false,
//           msg: "Failed to Save Verification details",
//         });
//       } else {
//         res.json({
//           success: true,
//           msg: "successfully created Verification details(Seifie)",
//           selfieUrl: `https://comiblock.herokuapp.com/profile/${req.file.filename}`,
//         });
//       }
//     });
//   }
// );

// app.post(
//   "/api/upload/govtid",
//   verify,
//   upload.single("profiles"),
//   (req, res) => {
//     var newVerification = Verification({
//       userEmail: req.user.email,
//       userFullname: req.user.fullname,
//       govtIdUrl: `https://comiblock.herokuapp.com/profile/${req.file.filename}`,
//     });
//     newVerification.save(function (err, Verification) {
//       if (err) {
//         res.json({
//           success: false,
//           msg: "Failed to Save Verification details",
//         });
//       } else {
//         res.json({
//           success: true,
//           msg: "successfully created Verification details(Govt ID)",
//           govtIdUrl: `https://comiblock.herokuapp.com/profile/${req.file.filename}`,
//         });
//       }
//     });
//   }
// );

// app.post(
//   "/api/upload/selfie",
//   verify,
//   upload.array("profiles", 2),
//   (req, res) => {
//     var newVerification = Verification({
//       userEmail: req.user.email,
//       userFullname: req.user.fullname,
//       govtIdUrl: `https://comiblock.herokuapp.com/profile/${req.files[0].filename}`,
//       selfieUrl: `https://comiblock.herokuapp.com/profile/${req.files[1].filename}`,
//     });
//     newVerification.save(function (err, Verification) {
//       if (err) {
//         res.json({
//           success: false,
//           msg: "Failed to Save Verification details",
//         });
//       } else {
//         res.json({
//           success: true,
//           msg: "successfully created Verification details",
//           govtIdUrl: `https://comiblock.herokuapp.com/profile/${req.files[0].filename}`,
//           selfieUrl: `https://comiblock.herokuapp.com/profile/${req.files[1].filename}`,
//         });
//       }
//     });
//   }
// );
