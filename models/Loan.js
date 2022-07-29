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
  collateralToken: {
    type: String,
    required: true,
  },
  collateralTokenAccount: {
    type: String,
    required: true,
  },
  borrowedAmount: {
    type: Number,
    required: true,
  },
  collateralAmount: {
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
  dailyRate: {
    type: Number,
    required: true,
  },
  totalRate: {
    type: Number,
    required: true,
  },
  repaymentAmount: {
    type: Number,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("loan", loanSchema);
