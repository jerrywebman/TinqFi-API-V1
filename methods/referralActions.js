var User = require("../models/user");
var Reward = require("../models/reward");


var functions = {
    //**COMPLETED */
    getReferrals: async function (req, res) {
        try {
            let totalQualifiedReferrals = 0;
            const totalReferral = await User.find({ referredBy: req.user.nickname })
            if (totalReferral.length > 0) {
                totalQualifiedReferrals = await totalReferral.filter((item) => item.accountSetup === true)
            }
            const isRewardDocAvailable = await Reward.findOne({ email: req.user.email });
            if (isRewardDocAvailable === null) {
                //create a new reward dowcument
                const rewardDoc = {
                    email: req.user.email,
                    nickname: req.user.nickname,
                }
                new Reward(rewardDoc).save();
            }
            const rewardArray = [
                {
                    id: "referTen",
                    title: "Refer 10 & Earn 100pts",
                    isAvailable: true,
                    earnedStatus: isRewardDocAvailable.referTen,
                    points: 100,
                    category: "Referral"
                },
                {
                    id: "referFifty",
                    title: "Refer 50 & Earn 800pts",
                    isAvailable: true,
                    earnedStatus: isRewardDocAvailable.referFifty,
                    points: 800,
                    category: "Referral"
                },
                {
                    id: "referHundred",
                    title: "Refer 100 & Earn 200pts",
                    isAvailable: true,
                    earnedStatus: isRewardDocAvailable.referHundred,
                    points: 2000,
                    category: "Referral"
                },
                {
                    id: "referOneThousand",
                    title: "Refer 1000 & Earn 12000pts",
                    isAvailable: true,
                    earnedStatus: isRewardDocAvailable.referOneThousand,
                    points: 12000,
                    category: "Referral"
                },
                {
                    id: "earnBonus",
                    title: "Create Flexible/Fixed Plan & Earn 200PTS",
                    isAvailable: true,
                    earnedStatus: isRewardDocAvailable.earnBonus,
                    points: 200,
                    category: "Earn"
                },
                {
                    id: "convertBonus",
                    title: "Swap Between - BNB,BTC,ETH,DOGE & Earn 400PTS",
                    isAvailable: true,
                    earnedStatus: isRewardDocAvailable.convertBonus,
                    points: 400,
                    category: "Convert"
                },
            ];
            const RewardData = await Reward.findOne({ email: req.user.email })
            res.send({
                success: true,
                msg: "Referral available",
                data: {
                    referralId: req.user.nickname,
                    referralLink: `https://tinqfi.com/referral/${req.user.nickname}`,
                    totalRewards: RewardData.totalRewards,
                    totalReferral: totalReferral.length,
                    qualifiedReferral: totalQualifiedReferrals.length,
                    task: rewardArray
                }
            });
        } catch (e) {
            res.status(500).send({
                success: false,
                msg: `server error: ${e.message}`
            })
        }
    },

    /** COMPLETED */
    checkinRoute: async function (req, res) {
        try {
            const checkedData = await Reward.findOne({ email: req.user.email })
            const aDayInMilliseconds = 86400000; //24 * 60 * 60 * 1000
            const today = Date.now();
            const lastCheckedIn = new Date(checkedData.lastCheckedIn);
            const dateDiff = today - lastCheckedIn;
            const lastTime = dateDiff / aDayInMilliseconds;
            if (lastTime < 1) {
                //credit user and send response
                const reward = await Reward.updateOne(
                    { email: req.user.email }, {
                    $inc: {
                        totalRewards: 50
                    },
                    $set: {
                        lastCheckedIn: Date.now()
                    }
                }
                )
                res.send({
                    success: true,
                    msg: "You just earned +50 points",
                });
            } else {
                res.send({
                    success: true,
                    msg: "You can only checkin once every 24 hours",
                });
            }
        } catch (e) {
            res.status(500).send({
                success: false,
                msg: `server error: ${e.message}`
            })
        }
    },

    /**GET TOKENS ROUTE */
    getPoints: async function (req, res) {
        try {
            const { points } = req.body;
            const id = req.params.id;
            const RewardData = await Reward.findOne({ email: req.user.email })
            if (RewardData[id] === false) {
                //search and get the user and transaction data
                const totalReferral = await User.find({ referredBy: req.user.nickname, accountSetup: true })

                switch (id) {
                    case "referTen": {
                        if (totalReferral.length > 9) {
                            const reward = await Reward.updateOne(
                                { email: req.user.email }, {
                                $inc: {
                                    totalRewards: 100
                                },
                                $set: {
                                    referTen: true
                                }
                            }
                            )
                            res.send({
                                success: true,
                                msg: "You just earned +100 points",
                            });

                        } else {
                            res.send({
                                success: true,
                                msg: `You have only ${totalReferral.length} referrals`,
                            });
                        }
                        break;
                    }
                    case "referFifty": {
                        if (totalReferral.length > 49) {
                            const reward = await Reward.updateOne(
                                { email: req.user.email }, {
                                $inc: {
                                    totalRewards: 800
                                },
                                $set: {
                                    referFifty: true
                                }
                            }
                            )
                            res.send({
                                success: true,
                                msg: "You just earned +800 points",
                            });

                        } else {
                            res.send({
                                success: true,
                                msg: `You have only ${totalReferral.length} referrals`,
                            });
                        }
                        break;
                    }
                    case "referHundred": {
                        if (totalReferral.length > 99) {
                            const reward = await Reward.updateOne(
                                { email: req.user.email }, {
                                $inc: {
                                    totalRewards: 2000
                                },
                                $set: {
                                    referHundred: true
                                }
                            }
                            )
                            res.send({
                                success: true,
                                msg: "You just earned +2000 points",
                            });

                        } else {
                            res.send({
                                success: true,
                                msg: `You have only ${totalReferral.length} referrals`,
                            });
                        }

                        break;
                    }

                    case "referOneThousand": {
                        if (totalReferral.length > 999) {
                            const reward = await Reward.updateOne(
                                { email: req.user.email }, {
                                $inc: {
                                    totalRewards: 12000
                                },
                                $set: {
                                    referOneThousand: true
                                }
                            }
                            )
                            res.send({
                                success: true,
                                msg: "You just earned +12000 points",
                            });

                        } else {
                            res.send({
                                success: true,
                                msg: `You have only ${totalReferral.length} referrals`,
                            });
                        }
                        break;
                    }
                    //earn bonus
                    case "earnBonus": {
                        if (totalReferral.length > 50) {
                            const reward = await Reward.updateOne(
                                { email: req.user.email }, {
                                $inc: {
                                    totalRewards: 200
                                },
                                $set: {
                                    earnBonus: true
                                }
                            }
                            )
                            res.send({
                                success: true,
                                msg: "You just earned +800 points",
                            });

                        } else {
                            res.send({
                                success: true,
                                msg: `You have only ${totalReferral.length} referrals`,
                            });
                        }
                        break;
                    }
                    case "convertBonus": {
                        if (totalReferral.length > 50) {
                            const reward = await Reward.updateOne(
                                { email: req.user.email }, {
                                $inc: {
                                    totalRewards: 400
                                },
                                $set: {
                                    convertBonus: true
                                }
                            }
                            )
                            res.send({
                                success: true,
                                msg: "You just earned +400 points",
                            });

                        } else {
                            res.send({
                                success: true,
                                msg: `You have only ${totalReferral.length} referrals`,
                            });
                        }
                        break;
                    }
                    default: {
                        res.send({
                            success: true,
                            msg: `You have only ${totalReferral.length} referrals`,
                        });

                        break;
                    }
                }

            } else {
                res.send({
                    success: false,
                    msg: "",
                });
            }
        } catch (e) {
            res.status(500).send({
                success: false,
                msg: `server error: ${e.message}`
            })
        }
    },
};

module.exports = functions;