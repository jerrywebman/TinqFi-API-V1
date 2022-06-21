var mongoose = require("mongoose");
var schema = mongoose.Schema;

var portfolioSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  portfolioImageUrl: {
    type: String,
    require: true,
  },
  intro: {
    type: String,
    require: true,
  },
  objectiveIntro: {
    type: String,
    require: true,
  },
  capAssets: {
    type: String,
    require: true,
  },
  capAssetsIntro: {
    type: String,
    require: true,
  },
  projectType: {
    type: String,
    require: true,
  },
  projectTypeIntro: {
    type: String,
    require: true,
  },
  term: {
    type: String,
    require: true,
  },
  termIntro: {
    type: String,
    require: true,
  },
  inception: {
    type: String,
    require: true,
  },
  currentHoldingsUrl: {
    type: String,
    require: true,
  },
  faceSheetUrl: {
    type: String,
    require: true,
  },
  quarterlyReportUrl: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    require: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Portfolio", portfolioSchema);
