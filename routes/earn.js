const express = require("express");
require("dotenv").config();
const earnActions = require("../methods/earnActions");

const verify = require("../middleware/verifyToken");

const router = express.Router();

//add earn ltv
router.post("/api/v1/earn/add_earn_ltv", earnActions.addEarnLTV);
//get all earn ltv
router.get("/api/v1/earn/all_plan", verify, earnActions.getAllEarnPackage);
//apply for fixed plan
router.post(
  "/api/v1/earn/apply/fixed",
  verify,
  earnActions.applyForFixedEarnPackage
);
//apply for flexible plan
router.post(
  "/api/v1/earn/apply/flexible",
  verify,
  earnActions.applyForFlexibleEarnPackage
);

//get all user closed fixed plan
router.get(
  "/api/v1/earn/get/subscriptions",
  verify,
  earnActions.getAllSubscriptions
);

// close a fixed plan
router.get(
  "/api/v1/earn/end/active/fixed/:orderId",
  verify,
  earnActions.closeAnEarnFixedPlan
);

// close a fLEXIBLE plan
router.get(
  "/api/v1/earn/end/active/flexible/:orderId",
  verify,
  earnActions.closeAnEarnFlexiblePlan
);

//get all user active flexible plan
// router.get(
//   "/api/v1/earn/get/active/flexible",
//   verify,
//   earnActions.getAllActiveFlexiblePlan
// );
// //get all user active fixed plan
// router.get(
//   "/api/v1/earn/get/active/fixed",
//   verify,
//   earnActions.getAllActiveFixedPlan
// );
// //get all user closed flexible plan
// router.get(
//   "/api/v1/earn/get/closed/flexible",
//   verify,
//   earnActions.getAllClosedFlexiblePlan
// );
// //get all user closed fixed plan
// router.get(
//   "/api/v1/earn/get/closed/fixed",
//   verify,
//   earnActions.getAllClosedFixedPlan
// );

module.exports = router;
