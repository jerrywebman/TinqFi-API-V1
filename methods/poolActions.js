var Pool = require("../models/Pool");
const axios = require("axios");
var TinqfiTrxn = require("../models/Transaction");

var functions = {
  //ADD A POOL DATA
  addPool: function (req, res) {
    try {
      const newPoolParams = {
        poolName: req.body.poolName,
        poolImageUrl: req.body.poolImageUrl,
        poolStatus: req.body.poolStatus,
        poolIntro: req.body.poolIntro,
        poolType: req.body.poolType,
        poolApy: req.body.poolApy,
        poolTag: req.body.poolTag,
        poolCurrency: req.body.poolCurrency,
        poolCap: req.body.poolCap,
        poolTarget: req.body.poolTarget,
        poolDuration: req.body.poolDuration,
        poolExpectedIncome: req.body.poolExpectedIncome,
        poolProfit: req.body.poolProfit,
        participants: [],
      };
      new Pool(newPoolParams).save().then(() =>
        res.json({
          success: true,
          msg: "New Pool Parameter added successfully",
        })
      );
    } catch (e) {
      res.status(500).send({
        success: false,
        msg: "Internal Server Error",
      });
    }
  },

  //GET ALL AVAILABLE POOL DATA
  getPool: async function (req, res) {
    try {
      const poolParams = await Pool.find().sort({ createdAt: -1 });
      res.json({
        success: true,
        msg: "User Active FIXED plans successfully fetched",
        data: poolParams,
      });
    } catch (e) {
      res.status(500).send({
        success: false,
        msg: "Internal Server Error",
      });
    }
  },

  //APPLY FOR A POOL
  subscribeToPool: async function (req, res) {
    try {
      const poolParams = await Pool.find({ _id: req.params.id });
      const token = poolParams.poolCurrency;
      const amount = req.body.amount;
      const uppercaseToken = token.toUpperCase();

      //SEARCH TO GET THE USER TOKEN ACCOUNT
      const searchIndex = await userArray.find(
        (user) => user.tokenAccountcurrency === uppercaseToken
      );
      const senderTokenAccountId = searchIndex.tokenAccountId;

      const formData = {
        senderAccountId: senderTokenAccountId,
        recipientAccountId:
          process.env["TINQFI_POOL_ACCOUNT_" + uppercaseToken],
        amount: String(amount),
        anonymous: false,
        compliant: false,
        transactionCode: req.user.email,
        paymentId: req.user.ourCustomerTatumId,
        recipientNote: `Pool on TinqFI on ${poolParams.poolName}`,
      };

      const url = `${process.env.TATUM_BASE_URL}/ledger/transaction`;
      try {
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.TATUM_API_KEY,
          },
          url,
          data: formData,
        };
        //step 2
        axios(options)
          .then(async (serverResponse) => {
            if (serverResponse.data.reference !== null) {
              //the response from Tatum
              const referenceId = await serverResponse.data.reference;
              //ADD THE PARTICIPANT
              const addParticipant = Pool.updateOne(
                { _id: req.params.id },
                {
                  $push: {
                    participants: {
                      userEmail: req.user.email,
                      tatumId: req.user.ourCustomerTatumId,
                      amount: Number(amount),
                      refId: referenceId,
                      priceInUsd: Number(amount),
                      token: uppercaseToken,
                      subscribedOn: Date.now(),
                    },
                  },
                }
              ).then(() => {
                //POST TRX HISTORY WITH THE USER DATA IN DB
                const newTinqfiTrxn = {
                  userEmail: req.user.email,
                  userTaTumId: req.user.ourCustomerTatumId,
                  transactionAmount: Number(amount),
                  transactionToken: uppercaseToken,
                  transactionType: "Pool",
                  from: senderDBAccountId,
                  tenure: `${poolParams.poolName} pool `,
                  to: process.env["TINQFI_POOL_ACCOUNT_" + uppercaseToken],
                  trxnRefId: referenceId,
                  debit: true,
                };
                new TinqfiTrxn(newTinqfiTrxn).save().then(() =>
                  res.json({
                    success: true,
                    msg: "Subscription Successful",
                  })
                );
              });
            } else
              res.status(401).send({
                success: false,
                msg: "Transaction Failed no response",
              });
          })
          .catch((err) => {
            console.log(err);
            res.status(403).send({
              success: false,
              msg: "insufficient balance or Sender unauthorized",
            });
          });
      } catch (e) {
        res.status(500).send({
          success: false,
          msg: "Transaction Failed, error from axios",
        });
      }
    } catch (e) {
      res.status(500).send({
        success: false,
        msg: "Internal Server Error",
      });
    }
  },
};

module.exports = functions;
