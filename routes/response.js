const express = require("express");
const responseActions = require("../methods/responseActions");
const verify = require("../middleware/verifyToken");
const router = express.Router();

router.post("/api/v1/response/:category", verify, responseActions.addResponse);

module.exports = router;
