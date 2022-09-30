var mongoose = require("mongoose");

var addressSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    require: true,
    unique: true,
    match: /.+\@.+\..+/,
    min: 6,
    max: 255,
  },
  nickname: {
    type: String,
    require: true,
    min: 2,
    max: 255,
  },
  ourCustomerTatumId: {
    type: String,
    unique: true,
  },
  onRegistration: {
    type: Array,
  },
  onP2P: {
    type: Array,
  },
  createdAt: {
    type: Date,
    require: true,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    require: true,
  },
});

module.exports = mongoose.model("address", addressSchema);
