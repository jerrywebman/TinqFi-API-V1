const express = require("express");
const convertActions = require("../methods/convertActions");

const verify = require("../middleware/verifyToken");

const router = express.Router();

router.post("/api/v1/convert/token", verify, convertActions.convert);

module.exports = router;
