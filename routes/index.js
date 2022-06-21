const express = require("express");
require("dotenv").config();
const actions = require("../methods/actions");
const transactionactions = require("../methods/transactionsActions");
const moneyactions = require("../methods/userMoneyActions");
const assessment = require("../methods/questionnaireResponseAction");
const portfolio = require("../methods/portfolioActions");
const strategy = require("../methods/strategyActions");

const verify = require("../verifyToken");

const router = express.Router();

// router.get("/", function (req, res) {
//   res.sendFile("views/test.html", { root: __dirname });
// });

router.get("/api", function (req, res) {
  if (req.session.viewCount) {
    req.session.viewCount++;
  } else {
    req.session.viewCount = 1;
  }
  res.send(
    `Hello Bro, Welcome to our Api Home, you visited ${req.session.viewCount}`
  );
  console.log(req.session);
});

router.get("/", function (req, res) {
  res.redirect("https://jerrycifeanyi.gitbook.io/comiblock-api-v2-docs/");
});

//LOGOUT A USER
router.delete("/logout", verify, actions.logout);

//** @desc ADD A NEW USER **
router.post("/api/signup", actions.signup);

//** @desc confirm a new/old user email**
router.post("/api/verify_email", actions.verifyEmail);

//@desc completes a user registration **
router.post("/api/complete_signup", actions.completeSignup);

//authenticate a user **
router.post("/api/login", actions.authenticate);

//@desc recover user account **
router.post("/api/recover_account", actions.recoverAccount);

//@desc change a user password **
router.post("/api/change_password", actions.updatePassword);

//@desc change a user password **
router.post("/api/change_password_auth", verify, actions.updatePasswordAuth);

// update legal aggreement**
router.post("/api/legal_agreement", verify, actions.updateLegal);

//docs from here

//@desc update a user pin **
router.post("/api/change_pin", verify, actions.updatePin);

//@desc debit a User Profile
router.get("/api/info/profile", actions.getInfo);

//** MONEY SECTION */

//@desc get a User Balance
router.get("/api/user/balance_auth", verify, moneyactions.getUserBalance);

//@desc get a User Balance
router.get("/api/user/balance", moneyactions.getAUserBalance);

//@desc get a User Balance
router.get(
  "/api/user/calculated_balance",
  verify,
  moneyactions.getUserBalanceCalculated
);

//@desc credit a User Origin Balance
router.post("/api/credit/origin/balance", moneyactions.addToUserOriginBalance);

//@desc credit a User emerge Balance
router.post("/api/credit/emerge/balance", moneyactions.addToUserEmergeBalance);

//@desc debit a User Balance Admin Route
router.post(
  "/api/admin/debit/balance",
  verify,
  moneyactions.minusFromUserBalance
);

//** INVESTMENT ASSESSMENT SECTION */

router.post(
  "/api/user/investment_response",
  verify,
  assessment.createQuestionaireResponse
);

router.get(
  "/api/admin/investment_response",
  verify,
  assessment.getAllAssessmenResult
);

//** USER BVN */
router.post("/api/update_bvn", verify, actions.updateBvn);

//** PORTFOLIO MANAGEMENT BY COMIBLOCK */
router.post("/api/admin/add_portfolio", verify, portfolio.createPortfolio);
router.get("/api/admin/get_all_portfolio", verify, portfolio.getAllPortfolio);
router.get(
  "/api/admin/get_a_portfolio/:id",
  verify,
  portfolio.getSinglePortfolio
);
router.delete(
  "/api/admin/delete_a_portfolio/:id",
  verify,
  portfolio.createPortfolio
);

//** STRATEGY PERFORMANCE MANAGEMENT */
router.post("/api/admin/add_strategy", verify, strategy.createStrategy);
router.get("/api/admin/get_all_strategy", verify, strategy.getAllStrategy);
router.get("/api/admin/get_a_strategy/", verify, strategy.getSingleStrategy);
router.delete(
  "/api/admin/delete_a_strategy/:id",
  verify,
  strategy.createStrategy
);

module.exports = router;
