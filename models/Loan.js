var mongoose = require("mongoose");

var loanSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
  },
  ourCustomerTatumId: {
    type: String,
    required: true,
  },
  borrowedToken: {
    type: String,
    required: true,
  },
  borrowedTokenAccount: {
    type: String,
    required: true,
  },
  borrowedTatumRefID: {
    type: String,
    required: true,
  },
  borrowedTokenAmountInUsd: {
    type: Number,
    required: true,
  },
  collateralToken: {
    type: String,
    required: true,
  },
  collateralTokenAccount: {
    type: String,
    required: true,
  },
  collateralTatumRefID: {
    type: String,
    required: true,
  },
  collateralTokenAmountInUsd: {
    type: Number,
    required: true,
  },
  borrowedAmount: {
    type: Number,
    required: true,
  },
  initialBorrowedTokenPrice: {
    type: Number,
    required: true,
  },
  collateralAmount: {
    type: Number,
    required: true,
  },
  initialCollateralTokenPrice: {
    type: Number,
    required: true,
  },
  interestToPay: {
    type: Number,
    required: true,
  },
  dailyInterestRate: {
    type: Number,
    required: true,
  },
  initialLTV: {
    type: Number,
    required: true,
  },
  marginCall: {
    type: Number,
    required: true,
  },
  liquidationLTV: {
    type: Number,
    required: true,
  },
  loanTenure: {
    type: Date,
    required: true,
  },
  dailyInterestRateInUsd: {
    type: Number,
    required: true,
  },
  totalInterestRateInUsd: {
    type: Number,
    required: true,
  },
  repaymentAmount: {
    type: Number,
    required: true,
  },
  topupLoan: {
    type: Array,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("loan", loanSchema);
