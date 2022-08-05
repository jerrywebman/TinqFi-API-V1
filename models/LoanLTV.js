var mongoose = require("mongoose");

var loanLTVSchema = new mongoose.Schema({
  _id: {
    type: String,
    require: true,
  },
  totalInterestRate: {
    type: Number,
    required: true,
  },
  initialLTV: {
    type: Number,
    required: true,
  },
  marginCall: {
    type: Number,
    required: true,
  },
  liquidationLTV: {
    type: Number,
    required: true,
  },
  loanTenure: {
    type: Array,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("loanLTV", loanLTVSchema);
