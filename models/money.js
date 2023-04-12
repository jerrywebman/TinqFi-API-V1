var mongoose = require("mongoose");
var schema = mongoose.Schema;

var moneySchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
    unique: true,
  },
  referredBy: {
    type: String,
    min: 6,
    max: 6,
  },
  nickname: {
    type: String,
    require: true,
  },
  investmentBalance: {
    type: Array,
  },
  loanBalance: {
    type: Array,
  },
  earnBalance: {
    type: Array,
  },
  savingsBalance: {
    type: Array,
  },
  referralBonusBalance: {
    type: Array,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("money", moneySchema);
