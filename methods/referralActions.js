var User = require("../models/user");
var Reward = require("../models/reward");


var functions = {
    getReferrals: async function (req, res) {
        try {
            const rewardArray = [
                {
                    name: "here is it",
                    isAvailable: true,
                },
                {
                    name: "here is it",
                    isAvailable: true,
                }
            ];
            let totalQualifiedReferrals = 0;
            const totalReferral = await User.find({ referredBy: "Jerrie" })
            if (totalReferral.length > 0) {
                totalQualifiedReferrals = await totalReferral.filter((item) => item.accountSetup === true)
            }
            const isRewardDocAvailable = await Reward.find({ email: req.user.email });

            if (isRewardDocAvailable.length === 0) {
                //create a new reward dowcument
                const rewardDoc = {
                    email: req.user.email,
                    nickname: req.user.nickname,
                }
                new Reward(rewardDoc).save();
            }
            //firstTen, secondTwenty etc/
            //checked in
            //create a checking route
            //compare the last time they checked in 
            res.send({
                success: true,
                msg: "Referral available",
                data: {
                    referralId: req.user.nickname,
                    referralLink: `https://tinqfi.com/referral/${req.user.nickname}`,
                    totalRewards: 0,
                    totalReferral: totalReferral.length,
                    qualifiedReferral: totalQualifiedReferrals.length,
                }
            });
        } catch (e) {
            res.status(500).send({
                success: false,
                msg: `server error: ${e.message}`
            })
        }
    },

    checkinRoute: async function (req, res) { },
};

module.exports = functions;