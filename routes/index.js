const express = require("express");
const actions = require("../methods/actions");
const verify = require("../middleware/verifyToken");
const router = express.Router();

// router.get("/", function (req, res) {
//   res.sendFile("views/test.html", { root: __dirname });
// });

router.get("/api", function (req, res) {
  try {
    if (req.session.viewCount) {
      req.session.viewCount++;
    } else {
      req.session.viewCount = 1;
    }
    res
      .status(200)
      .send(
        `Hello Dev, Welcome to our Api Home screen. if you are seeing this, be rest assured that the server is up and running, you visited ${req.session.viewCount}`
      );
    console.log(req.session);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/", function (req, res) {
  res.redirect("https://jerrycifeanyi.gitbook.io/tinqfi-api/");
});

//LOGOUT A USER
router.delete("/api/v1/logout", verify, actions.logout);

//** @desc ADD A NEW USER **
router.post("/api/v1/signup", actions.signup);

//** @desc confirm a new/old user email**
router.post("/api/v1/verify_email", actions.verifyEmail);

//** @desc RESEND OTP**
router.post("/api/v1/resend_otp", actions.resendOTP);

//** @desc RESEND OTP**
router.delete("/api/v1/delete_user", actions.deleteUser);

//@desc completes a user registration **
router.post("/api/v1/complete_signup", actions.completeSignup);

//authenticate a user **
router.post("/api/v1/login", actions.authenticate);

//@desc recover user account **
router.post("/api/v1/recover_account", actions.recoverAccount);

//@desc completes the user account recover **
router.post("/api/v1/complete_recovery", actions.updatePassword);

//@desc get a User Information **
router.get("/api/v1/info/user", actions.getInfo);

//DOCS FROM HERE
//@desc change a user password **
// router.post("/api/change_password_auth", verify, actions.updatePasswordAuth);

// // update legal aggreement**
// router.post("/api/legal_agreement", verify, actions.updateLegal);

// //@desc get a User Profile
// router.get("/api/info/profile", actions.getInfo);

// //@desc completes a user registration **
// router.post("/api/v1/createAddress", actions.addressTest);

// //@desc update a user pin **
// router.post("/api/change_pin", verify, actions.updatePin);

module.exports = router;
