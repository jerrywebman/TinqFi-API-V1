var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
    unique: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    // require: true,
    min: 6,
    max: 255,
  },
  pin: {
    type: String,
    // require: true,
    min: 4,
    max: 4,
  },
  referredBy: {
    type: String,
    // require: true,
    default: "",
  },
  fullname: {
    type: String,
    // require: true,
    min: 2,
    max: 255,
  },
  nickname: {
    type: String,
    // require: true,
    min: 2,
    max: 255,
  },
  phone: {
    type: String,
    // require: true,
    // unique: true,
  },

  address: {
    type: String,
    // require: true,
  },
  street: {
    type: String,
    // require: true,
  },
  city: {
    type: String,
    // require: true,
  },
  country: {
    type: String,
    // require: true,
  },
  occupation: {
    type: String,
    // require: true,
  },
  ourCustomerTatumId: {
    type: String,
    unique: true,
  },
  onRegistrationLedgerAccnts: {
    type: Array,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  issuer: {
    type: String,
    required: true,
  },
  verifyCode: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  accountSetup: {
    type: Boolean,
    default: false,
  },
  assessmentResponse: {
    type: Boolean,
    default: false,
  },
  accountVerified: {
    type: Boolean,
    default: false,
  },
  addressVerified: {
    type: Boolean,
    default: false,
  },
  legalAgreement: {
    type: Boolean,
    default: false,
  },
  dateJoined: {
    type: Date,
    default: Date.now,
  },
  lastLoginAt: {
    type: String
  },
});

//authenticate
userSchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};
//verifyEmail
userSchema.methods.compareCode = function (code, cb) {
  bcrypt.compare(code, this.verifyCode, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

//compare Pin
userSchema.methods.comparePin = function (trxnPin, cb) {
  bcrypt.compare(trxnPin, this.pin, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};
module.exports = mongoose.model("User", userSchema);
