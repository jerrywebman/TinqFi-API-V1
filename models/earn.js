var mongoose = require("mongoose");
var schema = mongoose.Schema;

var earnSchema = new mongoose.Schema({
  _id: {
    type: String,
    require: true,
  },
  userEmail: {
    type: String,
    require: true,
    match: /.+\@.+\..+/,
  },
  amount: {
    type: Number,
    require: true,
  },
  profitPercent: {
    type: Number,
    require: true,
  },
  ourCustomerTatumId: {
    type: String,
    require: true,
  },
  ourCustomerTokenId: {
    type: String,
    require: true,
  },
  earnTokenString: {
    type: String,
    require: true,
  },
  status: {
    type: Boolean,
    default: true,
    require: true,
  },
  activated: {
    type: Date,
    default: Date.now,
  },
  closing: {
    type: Date,
  },
});

module.exports = mongoose.model("earn", earnSchema);
