const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const passport = require("passport");
require("dotenv").config();
const cookieParser = require("cookie-parser");

// Connect to database
connectDB();

const app = express();

// Logging in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  "https://tinqlab.com",
  "https://www.tinqlab.com",
  "http://tinqlab.com",
  "http://www.tinqlab.com",
  // "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies / auth headers
  }),
);

// Optional: set headers for additional safety
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Authorization",
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// Passport initialization (if used)
app.use(passport.initialize());

// Routes
const tinqlabRoutes = require("./routes/tinqlab");
app.use("/api/tinqlab", tinqlabRoutes);

// Start server
const PORT = process.env.PORT || 4001;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`),
);
