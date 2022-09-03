const express = require("express");
require("dotenv").config();
const loanActions = require("../methods/loanActions");

const verify = require("../middleware/verifyToken");

const router = express.Router();

//LOAN ROUTES

//GET ALL LOANS
// router.get("/api/v1/transaction/checkdata", loanActions.checkData);
router.post("/api/v1/loan/add_ltv", loanActions.addLoanParams);
router.get("/api/v1/loan/select_ltv", verify, loanActions.selectLoanData);
router.post("/api/v1/loan/apply", verify, loanActions.applyForLoan);
router.get("/api/v1/loan/get_loans", verify, loanActions.getAllUserLoan);
router.get("/api/v1/loan/get/:id", verify, loanActions.selectALoan);
router.get("/api/v1/loan/topup/:id", verify, loanActions.topupCollateral);
router.get("/api/v1/loan/repay/:id", verify, loanActions.repayLoan);
// router.get("/api/v1/transaction/loans", loanActions.getLoanParams);

module.exports = router;
