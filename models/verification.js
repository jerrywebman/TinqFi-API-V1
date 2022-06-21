var mongoose = require("mongoose");
var schema = mongoose.Schema;

var verificationSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    require: true,
    match: /.+\@.+\..+/,
  },
  userFullname: {
    type: String,
    require: true,
  },
  selfieUrl: {
    type: String,
  },
  govtIdUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("verification", verificationSchema);
