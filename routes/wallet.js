const express = require("express");
require("dotenv").config();
const walletActions = require("../methods/walletActions");

const verify = require("../middleware/verifyToken");

const router = express.Router();

//WALLETS ROUTES

//GET ALL ACCOUNTS
router.get(
  "/api/v1/all_token_accounts",
  verify,
  walletActions.getAllTokenAccounts
);

//GET A WALLET ADDRESS
router.get(
  "/api/v1/token_account/:id/wallet_address",
  verify,
  walletActions.getAwalletAddress
);

//GET ALL THE BALANCES
router.get("/api/v1/portfolio/balance", verify, walletActions.getAllBalances);

module.exports = router;
