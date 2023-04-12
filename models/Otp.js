var mongoose = require("mongoose")
var bcrypt = require("bcrypt");

var otpSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/,
        min: 6,
        max: 255,
    },
    verifyCode: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});
//verify the otp
otpSchema.methods.compareCode = function (code, cb) {
    bcrypt.compare(code, this.verifyCode, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

exports.default = mongoose.model("Otp", otpSchema)