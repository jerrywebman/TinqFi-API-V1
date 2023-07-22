

var functions = {
    getAdvert: async function (req, res) {
        const pool = ["https://i.imgur.com/cdVHqjs.png", "https://i.imgur.com/yjyuEKM.png"]
        const home = ["https://i.imgur.com/lsswfBB.png", "https://i.imgur.com/LyuozYG.png"]
        try {
            res.send({
                success: true,
                msg: "Advert available",
                data: { pool, home }
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