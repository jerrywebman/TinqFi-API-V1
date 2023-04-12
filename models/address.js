var mongoose = require("mongoose");

var addressSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
    min: 6,
    max: 255,
  },
  nickname: {
    type: String,
    required: true,
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
    required: true,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("address", addressSchema);
