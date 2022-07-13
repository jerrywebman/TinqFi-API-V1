var mongoose = require("mongoose");
var schema = mongoose.Schema;

var moneySchema = new mongoose.Schema({
  _id: {
    type: String,
    require: true,
  },
  userEmail: {
    type: String,
    require: true,
    match: /.+\@.+\..+/,
    unique: true,
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
