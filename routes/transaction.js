const express = require("express");
require("dotenv").config();
const transactionActions = require("../methods/transactionActions");

const verify = require("../middleware/verifyToken");

const router = express.Router();

//GET ALL TRANSACTION
router.get(
  "/api/v1/transaction/all_transactions",
  verify,
  transactionActions.getAllTransaction
);

//GET A SINGLE TRANSACTION
router.get(
  "/api/v1/transaction/single_transaction/:id",
  verify,
  transactionActions.getSingleTransaction
);

//GET ALL TRANSFER
router.get(
  "/api/v1/transaction/all_transfers",
  verify,
  transactionActions.getAllTransferTransaction
);

//GET ALL INVEST
router.get(
  "/api/v1/transaction/all_investments",
  verify,
  transactionActions.getAllInvestmentTransaction
);

//GET ALL LOANS
router.get(
  "/api/v1/transaction/all_loans",
  verify,
  transactionActions.getAllLoanTransaction
);

//GET ALL EARN
router.get(
  "/api/v1/transaction/all_earn",
  verify,
  transactionActions.getAllEarnTransaction
);

//GET ALL SAVE
router.get(
  "/api/v1/transaction/all_save",
  verify,
  transactionActions.getAllSaveTransaction
);
//GET ALL WITHDRAWAL
router.get(
  "/api/v1/transaction/all_withdrawal",
  verify,
  transactionActions.getAllWithdrawalTransaction
);
//GET ALL DEPOSIT
router.get(
  "/api/v1/transaction/all_deposit",
  verify,
  transactionActions.getAllDepositTransaction
);

module.exports = router;
