var mongoose = require("mongoose");
var schema = mongoose.Schema;
var bcrypt = require("bcrypt");
var userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
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
    min: 6,
    max: 6,
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
    type: Number,
    // require: true,
    // unique: true,
  },
  bvn: {
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
  dateOfBirth: {
    type: String,
    require: true,
  },
  issuer: {
    type: String,
    require: true,
  },
  verifyCode: {
    type: String,
    require: true,
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
    type: String,
    require: true,
  },
});

//encrypt password
// userSchema.pre("save", function (next) {
//   var user = this;
//   if (this.isModified("password") || this.isNew) {
//     bcrypt.genSalt(10, function (err, salt) {
//       if (err) {
//         return next(err);
//       }
//       bcrypt.hash(user.password, salt, function (err, hash) {
//         if (err) {
//           return next(err);
//         }
//         user.password = hash;
//         next();
//       });
//     });
//   } else {
//     return next();
//   }
// });

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
module.exports = mongoose.model("User", userSchema);
