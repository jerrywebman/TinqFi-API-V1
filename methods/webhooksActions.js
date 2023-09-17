const axios = require("axios");

var functions = {
  //GET ALL WEBHOOKS NOTIFICATIONS
  getWebhooks: function (req, res) {
    try {
      console.log(req.body);
    } catch (err) {
      console.log(err);
      return res.status(503).send({
        success: false,
        msg: "Server unavailable",
      });
    }
  },
  //SET WEBHOOKS NOTIFICATIONS
  setWebhooks: function (req, res) {
    try {
      if (req.user.email !== "tinqlabtech@gmail.com") {
        res.send("not you")
      } else {
        const formUserData = {
          attr: {
            id: "632cec963c281051123c8d95",//customer token account id
            // address: "0xdb2c0e4166316a3daf8e280787091dda2d89ff9a",
            // chain: "BSC",
            url: "https://tinqfi.cyclic.app/api/v1/webhooks/get",
          },
          type: "ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION"
        };
        const url = `${process.env.TATUM_BASE_URL}/subscription/`;
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.TATUM_API_KEY,
          },
          url,
          data: formUserData,
        };
        //DONE
        axios(options).then((response) => {
          console.log(response);
        }).catch((err) => { console.log(err); });
      }

    } catch (err) {
      return res.status(503).send({
        success: false,
        error: err.message,
        msg: "Server unavailable",
      });
    }
  },
};

module.exports = functions;
