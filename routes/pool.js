const express = require("express");
const poolActions = require("../methods/poolActions");
const verify = require("../middleware/verifyToken");
const router = express.Router();

router.post("/api/v1/pool/add_pool", poolActions.addPool);
router.get("/api/v1/pool/explore_pool", verify, poolActions.explorePool);
router.get("/api/v1/pool/get_pool", verify, poolActions.getAllUserPool);
router.get("/api/v1/pool/subscribe/:id", verify, poolActions.subscribeToPool);

module.exports = router;
