var mongoose = require("mongoose");
var schema = mongoose.Schema;

var notificationSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  detail: {
    type: String,
    require: true,
  },
  imageUrl: {
    type: String,
    require: true,
  },
  button: {
    type: Boolean,
    require: true,
  },
  buttonLink: {
    type: String,
  },
  buttonActionWord: {
    type: String,
  },
  createdAt: {
    type: Date,
    require: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
