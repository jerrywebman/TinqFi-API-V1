const express = require("express");
require("dotenv").config();
const ledgerTransactionActions = require("../methods/ledgerTransactionActions");

const verify = require("../middleware/verifyToken");

const router = express.Router();

// TRANSFER TESTER
router.get(
  "/api/v1/transaction/TRANSFER",
  ledgerTransactionActions.transferToBlockchainTest
);

//MAKE  WITHDRAWAL
router.post(
  "/api/v1/transaction/withdrawal",
  verify,
  ledgerTransactionActions.makeWithdrawal
);

//MAKE INTERNAL TRANSFER TESTER docs done
router.get(
  "/api/v1/transaction/internal_transfer",
  verify,
  ledgerTransactionActions.makeInternalTransfer
);

//INVEST USING BSC
router.get(
  "/api/v1/transaction/invest/BSC",
  verify,
  ledgerTransactionActions.investInTinqFiBsc
);

// INVEST USING BTC
router.get(
  "/api/v1/transaction/invest/BTC",
  verify,
  ledgerTransactionActions.investInTinqFiBtc
);
// INVEST USING ETH
router.get(
  "/api/v1/transaction/invest/ETH",
  verify,
  ledgerTransactionActions.investInTinqFiEth
);

// INVEST USING DOGE
router.get(
  "/api/v1/transaction/invest/DOGE",
  verify,
  ledgerTransactionActions.investInTinqFiDoge
);

module.exports = router;
