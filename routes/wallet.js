const express = require("express");
require("dotenv").config();
const actions = require("../methods/actions");
const transactionactions = require("../methods/oldmethods/transactionsActions");
const moneyactions = require("../methods/oldmethods/userMoneyActions");
const assessment = require("../methods/oldmethods/questionnaireResponseAction");
const portfolio = require("../methods/oldmethods/portfolioActions");
const strategy = require("../methods/oldmethods/strategyActions");

const verify = require("../middleware/verifyToken");

const router = express.Router();

//WALLETS ROUTES

//LOGOUT A USER
router.delete("/api/v1/wallets", verify, actions.logout);

//** @desc ADD A NEW USER **
router.post("/api/v1/signup", actions.signup);

//** @desc confirm a new/old user email**
router.post("/api/v1/verify_email", actions.verifyEmail);

//@desc completes a user registration **
router.post("/api/v1/complete_signup", actions.completeSignup);

module.exports = router;
