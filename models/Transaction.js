var mongoose = require("mongoose");
var schema = mongoose.Schema;

var transactionSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    require: true,
    match: /.+\@.+\..+/,
  },
  transactionAmount: {
    type: Number,
  },
  transactionType: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("transaction", transactionSchema);
