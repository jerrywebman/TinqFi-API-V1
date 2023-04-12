

var functions = {
    getAdvert: async function (req, res) {
        const pool = ["https://i.imgur.com/s2LlBgc.png", "https://i.imgur.com/AAFKsl9.png"]
        const home = ["https://i.imgur.com/hPyucMq.png", "https://i.imgur.com/QQRcFoZ.png"]
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