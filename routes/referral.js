const express = require('express');
const router = express.Router();
const referralActions = require('../methods/referralActions')
const verify = require('../middleware/verifyToken')

router.get('/api/v1/referral', verify, referralActions.getReferrals);
router.get('/api/v1/referral/check-in', verify, referralActions.checkinRoute);
router.post('/api/v1/referral/points/:id', verify, referralActions.getPoints);

module.exports = router;