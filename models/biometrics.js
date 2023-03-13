var mongoose = require("mongoose");

var biometricsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
    min: 6,
    max: 255,
  },
  biometricsId: {
    type: String,
    unique: true,
    min: 2,
    max: 255,
  },
  modelNumber: {
    type: String,
    unique: true,
    min: 2,
    max: 255,
  },
  deviceName: {
    type: String,
    min: 2,
    max: 255,
  },
});

module.exports = mongoose.model("biometrics", biometricsSchema);
