var mongoose = require("mongoose");
var schema = mongoose.Schema;

var transactionSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    require: true,
    match: /.+\@.+\..+/,
  },
  userTaTumId: {
    type: String,
    require: true,
  },
  transactionAmount: {
    type: Number,
  },
  transactionToken: {
    type: String,
  },
  debit: {
    type: Boolean,
    require: true,
  },
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  trxnRefId: {
    type: String,
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
