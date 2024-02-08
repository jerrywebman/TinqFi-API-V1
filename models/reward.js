var mongoose = require("mongoose");
var schema = mongoose.Schema;

var rewardSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
    unique: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  totalRewards: {
    type: Number,
    default: 0,
  },
  referTen: {
    type: Boolean,
    default: false,
  },
  referFifty: {
    type: Boolean,
    default: false,
  },
  referHundred: {
    type: Boolean,
    default: false,
  },
  referOneThousand: {
    type: Boolean,
    default: false,
  },
  earnBonus: {
    type: Boolean,
    default: false,
  },
  convertBonus: {
    type: Boolean,
    default: false,
  },
  lastCheckedIn: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("reward", rewardSchema);
