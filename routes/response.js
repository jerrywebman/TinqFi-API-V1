const { Router } = require("express");
const express = require("express");
const router = express.router();
const responseActions = require("../methods/responseActions");
const verify = require("../middleware/verifyToken");

router.post("/api/v1/response/:category", verify, responseActions.addResponse);

module.exports = router;
