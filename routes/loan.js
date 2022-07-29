const express = require("express");
require("dotenv").config();
const loanActions = require("../methods/loanActions");

const verify = require("../middleware/verifyToken");

const router = express.Router();

//LOAN ROUTES

//GET ALL LOANS
router.get("/api/v1/transaction/loans", loanActions.getLoanParams);

module.exports = router;
