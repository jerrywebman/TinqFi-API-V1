var mongoose = require("mongoose");

var newEarnLtv = new mongoose.Schema({
  tokenImg: {
    type: String,
    require: true,
  },
  tokenName: {
    type: String,
    require: true,
  },
  tokenTicker: { type: String, require: true },
  minAmount: { type: Number, require: true },
  apy: { type: Number, require: true },
  maxAmount: { type: Number, require: true },
  plan: { type: String, require: true },
  earnTenure: {
    type: Array,
  },
  createdAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
});

module.exports = mongoose.model("EarnLtv", newEarnLtv);
