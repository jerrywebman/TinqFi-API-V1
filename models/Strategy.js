var mongoose = require("mongoose");
var schema = mongoose.Schema;

var strategySchema = new mongoose.Schema({
  emerge: {
    type: Number,
    require: true,
  },
  origin: {
    type: Number,
    require: true,
  },
  disrupters: {
    type: Number,
    require: true,
    defaultValue: 0,
  },
  droplet: {
    type: Number,
    require: true,
    defaultValue: 0,
  },
  createdAt: {
    type: Date,
    require: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Strategy", strategySchema);
