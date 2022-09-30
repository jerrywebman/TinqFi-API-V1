const express = require("express");
require("dotenv").config();
const withdrawalActions = require("../methods/specialMethods/withdrawalActions");

const verify = require("../middleware/verifyToken");

const router = express.Router();

//SUBMIT A WITHDRAWAL REQUEST FOR BITCOIN
router.post(
  "/api/v1/withdrawal/request/btc",
  verify,
  withdrawalActions.withdrawBtc
);
//SUBMIT A WITHDRAWAL REQUEST FOR ETHEREUM
router.post(
  "/api/v1/withdrawal/request/eth",
  verify,
  withdrawalActions.withdrawEth
);
//SUBMIT A WITHDRAWAL REQUEST FOR DOGE
router.post(
  "/api/v1/withdrawal/request/Doge",
  verify,
  withdrawalActions.withdrawDoge
);
//SUBMIT A WITHDRAWAL REQUEST FOR BINANCE SMART CHAIN
router.post(
  "/api/v1/withdrawal/request/bsc",
  verify,
  withdrawalActions.withdrawBsc
);

module.exports = router;
