var mongoose = require("mongoose");
var schema = mongoose.Schema;

var questionnaireSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    require: true,
    match: /.+\@.+\..+/,
    min: 6,
    max: 255,
  },
  userFullname: {
    type: String,
    require: true,
    min: 2,
    max: 255,
  },
  assessments: {
    type: Array,
    require: true,
  },
  createdAt: {
    type: Date,
    require: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Questionnaire", questionnaireSchema);
