var mongoose = require("mongoose");
var schema = mongoose.Schema;

var earnSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    require: true,
    match: /.+\@.+\..+/,
  },
  amount: {
    type: Number,
    require: true,
  },
  apy: {
    type: Number,
    require: true,
  },
  dailyProfit: {
    type: Number,
    require: true,
  },
  totalProfit: {
    type: Number,
    require: true,
  },
  ourCustomerTatumId: {
    type: String,
    require: true,
  },
  ourCustomerTokenId: {
    type: String,
    require: true,
  },
  tokenName: {
    type: String,
    require: true,
  },
  tokenTicker: {
    type: String,
    require: true,
  },
  tokenImageUrl: {
    type: String,
    require: true,
  },
  plan: {
    type: String,
    require: true,
  },
  active: {
    type: Boolean,
    default: true,
    require: true,
  },
  activatedDate: {
    type: Date,
    default: Date.now,
  },
  closingDate: {
    type: Date,
  },
  valueDate: {
    type: Date,
  },
});

module.exports = mongoose.model("Earn", earnSchema);
