const axios = require("axios");
var User = require("../models/user");
const formatAmount = require("../utils/index")
const formatAmountInUsd = require("../utils/formatUsd")
var TinqfiTrxn = require("../models/Transaction");
const getCurrentTokenPrice = require("../utils/getCurrentTokenPrice")

var functions = {
  //GET ALL WEBHOOKS NOTIFICATIONS
  getWebhooks: async function (req, res) {
    try {
      const { accountId, amount, reference, currency, txId, from, to, date } = req.body.data;
      //find the user
      let user = await User.findOne({ onRegistrationLedgerAccnts: { $all: [{ "$elemMatch": { tokenAccountId: accountId } }] } });
      //get token price in dollar
      const priceData = await getCurrentTokenPrice();
      //DO THE DOLLAR CALCULATIONS HERE
      const valueInDollar =
        Number(priceData[currency]) * Number(amount);

      if (user) {
        //post deposit trannsaction
        //find the user and get their email and tatum id
        const newTinqfiTrxn = {
          userEmail: user.email,
          userTaTumId: user.ourCustomerTatumId,
          transactionAmount: formatAmount(amount),
          transactionToken: currency,
          transactionAmountInUsd: formatAmountInUsd(valueInDollar),
          transactionState: "Successful",
          transactionDetails: `Deposited - ${amount + " of " + currency
            } at ${valueInDollar}`,
          transactionType: "Deposit",
          tenure: "Instant",
          from: from,
          to: to,
          debit: false,
          trxnRefId: txId,//add the network url here
        };
        new TinqfiTrxn(newTinqfiTrxn).save();
        res.status(200).send({
          success: true,
          msg: "Ok",
        });
      }
    } catch (err) {
      res.status(503).send({
        success: false,
        msg: "Server unavailable",
      });
    }
  },
  //SET WEBHOOKS NOTIFICATIONS
  setWebhooks: function (req, res) {
    //once a user account is created, set a webhook subscription.
    try {
      if (req.user.email !== "tinqlabtech@gmail.com") {
        res.send("not you")
      } else {
        const formUserData = {
          attr: {
            id: "632cfc5a664a0e32e3d4e1ef",//customer token account id
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
          res.send(response.data);
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
