const express = require("express");
const convertActions = require("../methods/convertActions");

const verify = require("../middleware/verifyToken");

const router = express.Router();

router.get("/api/v1/convert/data", verify, convertActions.getConvert);
router.post("/api/v1/convert/token", verify, convertActions.convert);

module.exports = router;
