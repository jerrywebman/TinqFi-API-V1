const express = require("express");
const tokenActions = require("../methods/tokenActions");
const verify = require("../middleware/verifyToken");
const router = express.Router();

router.get("/api/v1/tokens/all", verify, tokenActions.getAvailableTokens);

module.exports = router;