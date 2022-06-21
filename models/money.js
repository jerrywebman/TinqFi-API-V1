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
  userFullname: {
    type: String,
    require: true,
  },
  walletBalance: {
    type: Number,
  },
  originBalance: {
    type: Number,
  },
  emergeBalance: {
    type: Number,
  },
  referralBonusBalance: {
    type: Number,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("money", moneySchema);
