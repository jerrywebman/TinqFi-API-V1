var mongoose = require("mongoose");
var schema = mongoose.Schema;

var contactUsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
    // unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  budget: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("tinqlabContact", contactUsSchema);
