const express = require("express");
const poolActions = require("../methods/poolActions");
const verify = require("../middleware/verifyToken");
const router = express.Router();

router.post("/api/v1/pool/add_pool", poolActions.addPool);
router.get("/api/v1/pool/get_pool", poolActions.getPool);
router.get("/api/v1/pool/subscribe/:id", verify, poolActions.subscribeToPool);
router.get("/api/v1/pool/try", poolActions.trying);

module.exports = router;
