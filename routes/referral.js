const express = require('express');
const router = express.Router();
const referralActions = require('../methods/referralActions')
const verify = require('../middleware/verifyToken')

router.get('/api/v1/referral', verify, referralActions.getReferrals);

module.exports = router;