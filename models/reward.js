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
