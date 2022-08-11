const express = require("express");
require("dotenv").config();
const loanActions = require("../methods/loanActions");

const verify = require("../middleware/verifyToken");

const router = express.Router();

//LOAN ROUTES

//GET ALL LOANS
// router.get("/api/v1/transaction/checkdata", loanActions.checkData);
router.post("/api/v1/transaction/add_loan_ltv", loanActions.addLoanParams);
router.get("/api/v1/transaction/get_loan_ltv", loanActions.selectLoanData);
router.get("/api/v1/transaction/get_a_loan/:id", loanActions.selectALoan);
// router.get("/api/v1/transaction/loans", loanActions.getLoanParams);

module.exports = router;
