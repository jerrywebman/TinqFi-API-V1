const express = require("express");
require("dotenv").config();
const externalDataActions = require("../methods/externalDataActions");

const verify = require("../middleware/verifyToken");

const router = express.Router();

//EXTERNAL DATA ROUTES

//GET TOP 70
router.get(
  "/api/v1/data/market_data",
  verify,
  externalDataActions.getExternalData
);

//GET TOP 2 coins
router.get(
  "/api/v1/data/market_data/top_two",
  verify,
  externalDataActions.getTopTwoExternalData
);

//GET nEWS
router.get(
  "/api/v1/data/news_data",
  verify,
  externalDataActions.getCnaLatestNews
);

// router.get("/api/v1/data/tester", externalDataActions.gettester);

module.exports = router;
