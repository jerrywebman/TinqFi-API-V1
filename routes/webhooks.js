const express = require("express");
require("dotenv").config();
const webhooksActions = require("../methods/webhooksActions");

const verify = require("../middleware/verifyToken");

const router = express.Router();

//WALLETS ROUTES

//GET ALL ACCOUNTS
router.get(
  "/api/v1/webhooks/get",
  verify,
  webhooksActions.getWebhooks
);

//SET WEBHOOK SUBSCRIPTIONS
router.post(
  "/api/v1/webhooks/set",
  verify,
  webhooksActions.setWebhooks
);

module.exports = router;
