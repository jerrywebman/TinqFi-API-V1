var mongoose = require("mongoose");

var loanSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
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
  borrowedAmountInValue: {
    type: Number,
    required: true,
  },
  borrowedTokenAmountInUsd: {
    type: Number,
    required: true,
  },
  borrowedTatumRefID: {
    type: String,
    required: true,
  },
  initialBorrowedTokenPrice: {
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
  collateralAmountInValue: {
    type: Number,
    required: true,
  },
  collateralTokenAmountInUsd: {
    type: Number,
    required: true,
  },
  collateralTatumRefID: {
    type: String,
    required: true,
  },
  initialCollateralTokenPrice: {
    type: Number,
    required: true,
  },
  dailyInterestRateOnPlan: {
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
  dailyInterestToPayInUsd: {
    type: Number,
    required: true,
  },
  dailyInterestToPayInValue: {
    type: Number,
    required: true,
  },
  totalInterestRateInUsd: {
    type: Number,
    required: true,
  },
  totalInterestToPayInValue: {
    type: Number,
    required: true,
  },
  loanTenure: {
    type: Number,
    required: true,
  },
  repaymentAmountInValue: {
    type: Number,
    required: true,
  },
  topupLoan: {
    type: Array,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  endAt: { type: Date },
});

module.exports = mongoose.model("loan", loanSchema);
