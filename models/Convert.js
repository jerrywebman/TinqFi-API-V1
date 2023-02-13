var mongoose = require("mongoose");

var convertSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
  },
  userTatumId: {
    type: String,
    required: true,
  },
  fromTokenAccount: {
    type: String,
    required: true,
  },
  toTokenAccount: {
    type: String,
    required: true,
  },
  fromToken: {
    type: String,
    required: true,
  },
  toToken: {
    type: String,
    required: true,
  },
  fromValue: {
    type: Number,
    required: true,
  },
  fromValueInUsd: {
    type: Number,
    required: true,
  },
  toValue: {
    type: Number,
    required: true,
  },
  toValueInUsd: {
    type: Number,
    required: true,
  },
  toValueInUsdBeforeFee: {
    type: Number,
    required: true,
  },
  toValueBeforeFee: {
    type: Number,
    required: true,
  },
  feeTo: {
    type: String,
    required: true,
  },
  fee: {
    type: String,
    required: true,
  },
  toTinqFiAccount: {
    type: Boolean,
    default: false,
  },
  toUserAccount: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Convert", convertSchema);
