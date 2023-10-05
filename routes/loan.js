const express = require("express");
const loanActions = require("../methods/loanActions");

const verify = require("../middleware/verifyToken");

const router = express.Router();

//LOAN ROUTES

//GET ALL LOANS
// router.get("/api/v1/transaction/checkdata", loanActions.checkData);
// router.get("/api/v1/transaction/loans", loanActions.getLoanParams);
router.post("/api/v1/loan/add_ltv", loanActions.addLoanParams);
//GET A LOAN DATA
router.get("/api/v1/loan/get/:id", verify, loanActions.selectALoan);
//get the selected loan ltv
router.get("/api/v1/loan/select_ltv", loanActions.selectLoanData);
//APPLY FOR A LOAN
router.post("/api/v1/loan/apply", verify, loanActions.applyForLoan);
//GET ALL A USER LOAN
router.get("/api/v1/loan/get_loans", verify, loanActions.getAllUserLoan);
//TOPUP A LOAN
router.post("/api/v1/loan/topup/:id", verify, loanActions.topupCollateral);
//REPAY A LOAN
router.get("/api/v1/loan/repay/:id", verify, loanActions.repayLoan);

module.exports = router;
