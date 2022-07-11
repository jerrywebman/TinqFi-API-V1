const express = require("express");
require("dotenv").config();
const ledgerTransactionActions = require("../methods/ledgerTransactionActions");

const verify = require("../middleware/verifyToken");

const router = express.Router();

//WALLETS ROUTES

// INTERNAL WITHDRAWAL FUNCTIONS
router.get(
  "/api/v1/transaction/internal_transfer",
  verify,
  ledgerTransactionActions.investInTinqFi
);

module.exports = router;
