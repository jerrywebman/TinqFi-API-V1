const express = require("express");
const tinqlabActions = require("../methods/tinqlabActions");
const router = express.Router();

router.get("/api/tinqlab/wake", function (req, res) {
  try {
    res.status(200).send(`Hello Dev, Am up now`);
  } catch (err) {
    res.status(500).send(err);
  }
});

//** @desc ADD A NEW USER **
router.post("/api/tinqlab/contact-us", tinqlabActions.contactUs);

module.exports = router;
