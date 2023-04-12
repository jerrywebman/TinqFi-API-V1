const express = require("express");
const biometricsActions = require("../methods/biometricsActions");

const verify = require("../middleware/verifyToken");

const router = express.Router();

router.post(
  "/api/v1/biometrics/activate",
  verify,
  biometricsActions.activateAccount
);
router.get("/api/v1/biometrics/verify", verify, biometricsActions.verifyAccount);

module.exports = router;
