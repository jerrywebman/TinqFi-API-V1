

var functions = {
    getReferrals: async function (req, res) {
        try {
            res.send({
                success: true,
                msg: "Referral available",
                data: {
                    referralId: req.user.nickname,
                    referralLink: `https://tinqfi.com/referral/${req.user.nickname}`,
                    totalRewards: 0,
                    totalReferral: 0,
                    qualifiedReferral: 0,
                }
            });

        } catch (e) {
            res.status(500).send({
                success: false,
                msg: `server error: ${e.message}`
            })
        }
    }

};

module.exports = functions;