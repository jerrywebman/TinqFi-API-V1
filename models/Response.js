var mongoose = require("mongoose");

var responseSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  response: {
    type: Array,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Response", responseSchema);
