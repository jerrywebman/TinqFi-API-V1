var TinqfiTrxn = require("../../models/Transaction");
const axios = require("axios");

var functions = {
  //BITCOIN WITHDRAWAL
  withdrawBtc: function (req, res) {
    try {
      //get the currency
      const currency = req.body.currency;
      const uppercaseCurrency = currency.toUpperCase();
      //get the sender address account id
      const senderAccountId = req.body.senderAccountId;
      //get the token account details of the logged in user
      const userArray = req.user.onRegistrationLedgerAccnts;
      const searchIndex = userArray.find(
        (user) => user.tokenAccountcurrency === uppercaseCurrency
      );
      const senderBtcAccountIdFromDb = searchIndex.tokenAccountId;

      if (process.env.BTC_STOP_WITHDRAWAL === "true") {
        res.status(503).send({
          success: false,
          msg: "Bitcoin withdrawal is paused, maintenance ongoing",
        });
      } else if (senderBtcAccountIdFromDb === senderAccountId) {
        //get the ammount and the address of the user
        const address = req.body.address;
        const amount = req.body.amount;
        const senderNote = req.body.senderNote || "";

        //hit the tatum api
        const url = `${process.env.TATUM_BASE_URL}/offchain/bitcoin/transfer`;
        const formData = {
          address,
          amount: String(amount),
          senderAccountId,
          signatureId: process.env.TATUM_BTC_SIGNATURE_ID,
          senderNote,
          xpub: process.env.BTC_XPUB,
        };
        try {
          const options = {
            method: "POST",
            headers: {
              "x-api-key": process.env.TATUM_API_KEY,
            },
            url,
            data: formData,
          };
          //try sending to the kms
          axios(options)
            .then((ServerResponse) => {
              if (ServerResponse.data.errorCode === "balance.insufficient") {
                res.status(400).send({
                  success: false,
                  msg: "Insufficient balance ..",
                });
              }
              const response = ServerResponse.data.signatureId;
              // console.log(ServerResponse);

              //post a transaction and tell the user it is successful
              // if (response != undefined || response != null) {
              //POST TRX HISTORY WITH THE USER DATA IN DB
              const newTinqfiTrxn = {
                userEmail: req.user.email,
                userTaTumId: req.user.ourCustomerTatumId,
                transactionAmount: amount,
                transactionToken: currency,
                transactionType: "Withdrawal",
                tenure: "Instant",
                from: "wallet",
                to: address,
                trxnRefId: response,
              };
              new TinqfiTrxn(newTinqfiTrxn).save();
              res.json({
                success: true,
                msg: "Withdrawal Request Successful",
              });
              // }
            })
            .catch((err) => {
              res.status(400).send({
                success: false,
                msg: "Insufficient balance",
              });
            });
        } catch (err) {
          res.status(400).send({
            success: false,
            msg: "error occurred from while initiating the withdrawal",
          });
        }
      } else {
        res.status(400).send({
          success: false,
          msg: "An error occured, Wrong account details",
        });
      }
    } catch (e) {
      res.status(503).send({
        success: false,
        msg: "Server unavailable",
      });
    }
  },
  //ETHEREUM WITHDRAWAL
  withdrawEth: function (req, res) {
    try {
      //get the currency
      const currency = req.body.currency;
      const uppercaseCurrency = currency.toUpperCase();
      //get the sender address account id
      const senderAccountId = req.body.senderAccountId;
      //get the token account details of the logged in user
      const userArray = req.user.onRegistrationLedgerAccnts;
      const searchIndex = userArray.find(
        (user) => user.tokenAccountcurrency === uppercaseCurrency
      );
      const senderEthAccountIdFromDb = searchIndex.tokenAccountId;

      if (process.env.ETH_STOP_WITHDRAWAL === "true") {
        res.status(503).send({
          success: false,
          msg: "Ethereum withdrawal is paused, maintenance ongoing",
        });
      } else if (senderEthAccountIdFromDb === senderAccountId) {
        //get the ammount and the address of the user
        const address = req.body.address;
        const amount = req.body.amount;
        const senderNote = req.body.senderNote || "";

        //hit the tatum api
        const url = `${process.env.TATUM_BASE_URL}/offchain/ethereum/transfer`;
        const formData = {
          address,
          amount: String(amount),
          senderAccountId,
          signatureId: process.env.TATUM_ETH_SIGNATURE_ID,
          senderNote,
        };
        try {
          const options = {
            method: "POST",
            headers: {
              "x-api-key": process.env.TATUM_API_KEY,
            },
            url,
            data: formData,
          };
          //try sending to the kms
          axios(options)
            .then((ServerResponse) => {
              if (ServerResponse.data.errorCode === "balance.insufficient") {
                res.status(400).send({
                  success: false,
                  msg: "Insufficient balance ..",
                });
              }
              const response = ServerResponse.data.signatureId;
              // console.log(ServerResponse);

              //post a transaction and tell the user it is successful
              // if (response != undefined || response != null) {
              //POST TRX HISTORY WITH THE USER DATA IN DB
              const newTinqfiTrxn = {
                userEmail: req.user.email,
                userTaTumId: req.user.ourCustomerTatumId,
                transactionAmount: amount,
                transactionToken: currency,
                transactionType: "Withdrawal",
                tenure: "Instant",
                from: "wallet",
                to: address,
                trxnRefId: response,
              };
              new TinqfiTrxn(newTinqfiTrxn).save();
              res.json({
                success: true,
                msg: "Withdrawal Request Successful",
              });
              // }
            })
            .catch((err) => {
              res.status(400).send({
                success: false,
                msg: "Insufficient balance",
              });
            });
        } catch (err) {
          res.status(400).send({
            success: false,
            msg: "error occurred from while initiating the withdrawal",
          });
        }
      } else {
        res.status(400).send({
          success: false,
          msg: "An error occured, Wrong account details",
        });
      }
    } catch (e) {
      res.status(503).send({
        success: false,
        msg: "Server unavailable",
      });
    }
  },
  //BINANCE WITHDRAWAL
  withdrawBsc: function (req, res) {
    try {
      //get the currency
      const currency = req.body.currency;
      const uppercaseCurrency = currency.toUpperCase();
      //get the sender address account id
      const senderAccountId = req.body.senderAccountId;
      //get the token account details of the logged in user
      const userArray = req.user.onRegistrationLedgerAccnts;
      const searchIndex = userArray.find(
        (user) => user.tokenAccountcurrency === uppercaseCurrency
      );
      const senderBscAccountIdFromDb = searchIndex.tokenAccountId;

      if (process.env.BSC_STOP_WITHDRAWAL === "true") {
        res.status(503).send({
          success: false,
          msg: "Binance Smart Chain withdrawal is paused, maintenance ongoing",
        });
      } else if (senderBscAccountIdFromDb === senderAccountId) {
        //get the ammount and the address of the user
        const address = req.body.address;
        const amount = req.body.amount;
        const senderNote = req.body.senderNote || "";

        //hit the tatum api
        const url = `${process.env.TATUM_BASE_URL}/offchain/bsc/transfer`;
        const formData = {
          address,
          amount: String(amount),
          senderAccountId,
          signatureId: process.env.TATUM_BSC_SIGNATURE_ID,
          senderNote,
        };
        try {
          const options = {
            method: "POST",
            headers: {
              "x-api-key": process.env.TATUM_API_KEY,
            },
            url,
            data: formData,
          };
          //try sending to the kms
          axios(options)
            .then((ServerResponse) => {
              if (ServerResponse.data.errorCode === "balance.insufficient") {
                res.status(400).send({
                  success: false,
                  msg: "Insufficient balance ..",
                });
              }
              const response = ServerResponse.data.signatureId;
              // console.log(ServerResponse);

              //post a transaction and tell the user it is successful
              // if (response != undefined || response != null) {
              //POST TRX HISTORY WITH THE USER DATA IN DB
              const newTinqfiTrxn = {
                userEmail: req.user.email,
                userTaTumId: req.user.ourCustomerTatumId,
                transactionAmount: amount,
                transactionToken: currency,
                transactionType: "Withdrawal",
                tenure: "Instant",
                from: "wallet",
                to: address,
                trxnRefId: response,
              };
              new TinqfiTrxn(newTinqfiTrxn).save();
              res.json({
                success: true,
                msg: "Withdrawal Request Successful",
              });
              // }
            })
            .catch((err) => {
              res.status(400).send({
                success: false,
                msg: "Insufficient balance",
              });
            });
        } catch (err) {
          res.status(400).send({
            success: false,
            msg: "error occurred from while initiating the withdrawal",
          });
        }
      } else {
        res.status(400).send({
          success: false,
          msg: "An error occured, Wrong account details",
        });
      }
    } catch (e) {
      res.status(503).send({
        success: false,
        msg: "Server unavailable",
      });
    }
  },
  //DOGECOIN WITHDRAWAL
  withdrawDoge: function (req, res) {
    try {
      //get the currency
      const currency = req.body.currency;
      const uppercaseCurrency = currency.toUpperCase();
      //get the sender address account id
      const senderAccountId = req.body.senderAccountId;
      //get the token account details of the logged in user
      const userArray = req.user.onRegistrationLedgerAccnts;
      const searchIndex = userArray.find(
        (user) => user.tokenAccountcurrency === uppercaseCurrency
      );
      const senderDogeAccountIdFromDb = searchIndex.tokenAccountId;

      if (process.env.DOGE_STOP_WITHDRAWAL === "true") {
        res.status(503).send({
          success: false,
          msg: "Dogecoin withdrawal is paused, maintenance ongoing",
        });
      } else if (senderDogeAccountIdFromDb === senderAccountId) {
        //get the ammount and the address of the user
        const address = req.body.address;
        const amount = req.body.amount;
        const senderNote = req.body.senderNote || "";

        //hit the tatum api
        const url = `${process.env.TATUM_BASE_URL}/offchain/bitcoin/transfer`;
        const formData = {
          address,
          amount: String(amount),
          senderAccountId,
          signatureId: process.env.TATUM_DOGE_SIGNATURE_ID,
          senderNote,
          xpub: process.env.DOGE_XPUB,
        };
        try {
          const options = {
            method: "POST",
            headers: {
              "x-api-key": process.env.TATUM_API_KEY,
            },
            url,
            data: formData,
          };
          //try sending to the kms
          axios(options)
            .then((ServerResponse) => {
              if (ServerResponse.data.errorCode === "balance.insufficient") {
                res.status(400).send({
                  success: false,
                  msg: "Insufficient balance ..",
                });
              }
              const response = ServerResponse.data.signatureId;
              // console.log(ServerResponse);

              //post a transaction and tell the user it is successful
              // if (response != undefined || response != null) {
              //POST TRX HISTORY WITH THE USER DATA IN DB
              const newTinqfiTrxn = {
                userEmail: req.user.email,
                userTaTumId: req.user.ourCustomerTatumId,
                transactionAmount: amount,
                transactionToken: currency,
                transactionType: "Withdrawal",
                tenure: "Instant",
                from: "wallet",
                to: address,
                trxnRefId: response,
              };
              new TinqfiTrxn(newTinqfiTrxn).save();
              res.json({
                success: true,
                msg: "Withdrawal Request Successful",
              });
              // }
            })
            .catch((err) => {
              res.status(400).send({
                success: false,
                msg: "Insufficient balance",
              });
            });
        } catch (err) {
          res.status(400).send({
            success: false,
            msg: "error occurred from while initiating the withdrawal",
          });
        }
      } else {
        res.status(400).send({
          success: false,
          msg: "An error occured, Wrong account details",
        });
      }
    } catch (e) {
      res.status(503).send({
        success: false,
        msg: "Server unavailable",
      });
    }
  },
};

module.exports = functions;
