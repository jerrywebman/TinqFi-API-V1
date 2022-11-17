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

//** ACCOUNT SECTION DONE */

//@desc get a User Information **
router.get("/api/v1/info/user", actions.getInfo);

//@desc get a User Information **
router.get("/api/v1/account/user", verify, actions.getInfos);

//** @desc UPDATE USER PROFILE
router.post("/api/v1/account/user/update", verify, actions.updateInfos);

//** @desc GET THE APP INFO
router.get("/api/v1/appinfo", actions.appInfo);

module.exports = router;
