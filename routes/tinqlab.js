const express = require("express");
const tinqlabActions = require("../methods/tinqlabActions");
const router = express.Router();

router.get("/api/tinqlab/wake", function (req, res) {
  try {
    res.status(200).json({
      success: false,
      msg: "Hello Dev, Am up now`",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Strugling`",
    });
  }
});

//** @desc ADD A NEW USER **
router.post("/api/tinqlab/contact-us", tinqlabActions.contactUs);

module.exports = router;
