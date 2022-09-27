const express = require("express");
const faqActions = require("../methods/faqActions");
// const verify = require("../middleware/verifyToken");
const router = express.Router();

router.post("/api/v1/faq/add_faq", faqActions.addFaq);
router.delete("/api/v1/faq/delete_faq/:id", faqActions.deleteFaq);
router.get("/api/v1/faq/get_faq/:category", faqActions.getFaq);

module.exports = router;
