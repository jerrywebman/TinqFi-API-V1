const express = require('express');
const router = express.Router();
const advertActions = require("../methods/advertActions");

router.get("/api/v1/adverts", advertActions.getAdvert);

module.exports = router;