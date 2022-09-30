const express = require("express");
const poolActions = require("../methods/poolActions");
const verify = require("../middleware/verifyToken");
const router = express.Router();

router.post("/api/v1/pool/add_pool_plan", poolActions.addPool);
router.get("/api/v1/pool/get_pool_plan", poolActions.getPool);

module.exports = router;
