var mongoose = require("mongoose");

var poolSchema = new mongoose.Schema({
  poolName: {
    type: String,
    required: true,
  },
  poolImageUrl: {
    type: String,
    required: true,
  },
  poolStatus: {
    type: String,
    required: true,
  },
  poolIntro: {
    type: String,
    required: true,
  },
  poolType: {
    type: String,
    required: true,
  },
  poolApy: {
    type: String,
    required: true,
  },
  poolTag: {
    type: String,
    required: true,
  },
  poolCurrency: {
    type: String,
    required: true,
  },
  poolCap: {
    type: String,
    required: true,
  },
  poolMinAmountInUsd: {
    type: Number,
    required: true,
  },
  poolMaxAmountInUsd: {
    type: Number,
    required: true,
  },
  poolTarget: {
    type: Number,
    required: true,
  },
  poolDuration: {
    type: Number,
    required: true,
  },
  poolExpectedIncome: {
    type: String,
    required: true,
  },
  poolProfit: {
    type: Number,
  },
  createdAt: {
    type: Date,
    require: true,
    default: Date.now,
  },
  participants: { type: Array },
});

module.exports = mongoose.model("pool", poolSchema);
