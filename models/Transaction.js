var mongoose = require("mongoose");
var schema = mongoose.Schema;

var transactionSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
  },
  userTaTumId: {
    type: String,
    required: true,
  },
  transactionAmount: {
    type: Number,
  },
  transactionToken: {
    type: String,
  },
  debit: {
    type: Boolean,
    required: true,
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
  transactionState: {
    type: String,
    enum: ["Pending", "Successful", "Failed"],
    required: true,
  },
  transactionDetails: {
    type: String,
  },
  tenure: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("transaction", transactionSchema);
