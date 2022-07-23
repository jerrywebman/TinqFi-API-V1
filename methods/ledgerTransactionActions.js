const { createClient } = require("redis");
var TinqfiTrxn = require("../models/Transaction");
const axios = require("axios");

var functions = {
  //MAKE INTERNAL TRANSFER
  makeInternalTransfer: function (req, res) {
    //security checks: min withdrawal, max transfer, check amount,
    // res.send({ success: true, msg: "Internal transfer route" });
    //CHECK THE ADDRESS, IF IN TATUM
    const currency = req.body.currency;
    const address = req.body.address;
    const url = `${process.env.TATUM_BASE_URL}/offchain/account/address/${address}/${currency}`;
    try {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.TATUM_API_KEY,
        },
        url,
      };
      //step 2
      axios(options)
        .then(async (serverResponse) => {
          if (serverResponse.data !== null) {
            //the response from Tatum
            console.log(serverResponse.data);
            const recieverTokenAccountId = await serverResponse.data.id;
            //NOW MAKE THE TRANSFER
            const userArray = req.user.onRegistrationLedgerAccnts;
            const searchIndex = userArray.find(
              (user) => user.tokenAccountcurrency === currency
            );
            const senderTokenAccountId = await searchIndex.tokenAccountId;
            console.log("SenderID", senderTokenAccountId);
            console.log("RecieverID", recieverTokenAccountId);
            const formData = {
              senderAccountId: senderTokenAccountId,
              recipientAccountId: recieverTokenAccountId,
              amount: req.body.amount,
              anonymous: false,
              compliant: false,
              transactionCode: req.user.email,
              paymentId: req.user.ourCustomerTatumId,
              recipientNote: req.body.recipientNote,
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
              //
              axios(options)
                .then((serverResponse) => {
                  if (serverResponse.data !== null) {
                    //the response from Tatum
                    const referenceId = serverResponse.data.reference;
                    //DONE
                    //POST TRX HISTORY WITH THE USER DATA IN DB
                    const newTinqfiTrxn = {
                      userEmail: req.user.email,
                      userTaTumId: req.user.ourCustomerTatumId,
                      transactionAmount: req.body.amount,
                      transactionToken: currency,
                      transactionType: "Transfer",
                      from: senderTokenAccountId,
                      to: recieverTokenAccountId,
                      trxnRefId: referenceId,
                    };
                    new TinqfiTrxn(newTinqfiTrxn).save().then(() =>
                      res.json({
                        success: true,
                        Message: "Transaction Successful",
                        trxnRefId: referenceId,
                      })
                    );
                  } else
                    res.status(403).send({
                      success: false,
                      Message: "Transaction Failed no response",
                    });
                })
                .catch((err) => {
                  res.status(401).send({
                    success: false,
                    Message: "Transaction Failed, insufficient balance",
                  });
                });
            } catch (e) {
              res.status(500).send({
                success: false,
                Message: "Transaction Failed",
              });
            }
            //TRANSFER FUNCTION ENDS HERE
          } else console.log("serverResponse", serverResponse);
        })

        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log(e.data);
    }
    //SEND THE TOKEN TO THE ADDRESS
  },

  //MAKE WITHDRAWAL
  makeWithdrawal: async function (req, res) {
    //security checks: min withdrawal, max transfer, check amount,
    // res.send({ success: true, msg: "Internal transfer route" });
    //GET THE ADDRESS CURRENCY AND AMOUNT
    const currency = req.body.currency;
    const address = req.body.address;
    const amount = req.body.amount;
    //NOW GET THE  SENDER ACCOUNT ID FOR THE SELECTED TOKEN
    const userAccountArray = req.user.onRegistrationLedgerAccnts;
    const searchIndex = userAccountArray.find(
      (user) => user.tokenAccountcurrency === "BTC"
    );
    const senderTokenAccountId = await searchIndex.tokenAccountId;
    const url = `${process.env.TATUM_BASE_URL}/offchain/bitcoin/transfer`;
    const formData = {
      senderAccountId: senderTokenAccountId,
      address: address,
      amount: amount,
      compliant: false,
      fee: "0.0005",
      mnemonic:
        "urge pulp usage sister evidence arrest palm math please chief egg abuse",
      xpub: "xpub6EsCk1uU6cJzqvP9CdsTiJwT2rF748YkPnhv5Qo8q44DG7nn2vbyt48YRsNSUYS44jFCW9gwvD9kLQu9AuqXpTpM1c5hgg9PsuBLdeNncid",
      senderNote: "Sender note",
    };
    console.log(formData);
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
          res.json({ serverResponse: serverResponse.data });
        })
        .catch((err) => {
          res.json({ axioserror: err });
        });
    } catch (e) {
      console.log(e.data);
      res.send("from catch", e);
      res.json({ fcatch: e });
    }
  },

  //TRANSFER TO A BLOCKCHAIN
  transferToBlockchainTest: function (req, res) {
    const formData = {
      senderAccountId: "62c4370fa30e794c7a7b5cf1",
      recipientAccountId: "62cc2d586882783d8ae8c5e4",
      amount: "30",
      anonymous: false,
      compliant: false,
      transactionCode: req.user.email,
      paymentId: "req.user.ourCustomerTatumId",
      recipientNote: "req.body.recipientNote",
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
        .then((serverResponse) => {
          if (serverResponse.data !== null) {
            //the response from Tatum
            console.log(serverResponse.data);
          } else console.log(serverResponse);
        })

        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
  },
  //INVEST IN TINQFI BTC
  investInTinqFiBtc: function (req, res) {
    const userArray = req.user.onRegistrationLedgerAccnts;
    const searchIndex = userArray.find(
      (user) => user.tokenAccountcurrency === "BTC"
    );
    const senderBtcAccountId = searchIndex.tokenAccountId;
    const formData = {
      senderAccountId: senderBtcAccountId,
      recipientAccountId: process.env.TINQFI_INVESTMENT_ACCOUNT_BTC,
      amount: req.body.amount,
      anonymous: false,
      compliant: false,
      transactionCode: req.user.email,
      paymentId: req.user.ourCustomerTatumId,
      recipientNote: req.body.recipientNote,
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
      //
      axios(options)
        .then((serverResponse) => {
          if (serverResponse.data !== null) {
            //the response from Tatum
            const referenceId = serverResponse.data.reference;
            //DONE
            //POST TRX HISTORY WITH THE USER DATA IN DB
            const newTinqfiTrxn = {
              userEmail: req.user.email,
              userTaTumId: req.user.ourCustomerTatumId,
              transactionAmount: req.body.amount,
              transactionToken: "BTC",
              transactionType: "Invest",
              from: senderBtcAccountId,
              to: process.env.TINQFI_INVESTMENT_ACCOUNT_BTC,
              trxnRefId: referenceId,
            };
            new TinqfiTrxn(newTinqfiTrxn).save().then(() =>
              res.json({
                success: true,
                Message: "Transaction Successful",
                trxnRefId: referenceId,
              })
            );
          } else
            res.status(403).send({
              success: false,
              Message: "Transaction Failed no response",
            });
        })
        .catch((err) => {
          res.status(403).send({
            success: false,
            Message: "Transaction Failed, insufficient balance",
          });
        });
    } catch (e) {
      res.status(500).send({
        success: false,
        Message: "Transaction Failed",
      });
    }
  },

  //INVEST IN TINQFI BSC
  investInTinqFiBsc: function (req, res) {
    const userArray = req.user.onRegistrationLedgerAccnts;
    const searchIndex = userArray.find(
      (user) => user.tokenAccountcurrency === "BSC"
    );
    const senderBscAccountId = searchIndex.tokenAccountId;
    const formData = {
      senderAccountId: senderBscAccountId,
      recipientAccountId: process.env.TINQFI_INVESTMENT_ACCOUNT_BSC,
      amount: req.body.amount,
      anonymous: false,
      compliant: false,
      transactionCode: req.user.email,
      paymentId: req.user.ourCustomerTatumId,
      recipientNote: req.body.recipientNote,
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
      //
      axios(options)
        .then((serverResponse) => {
          if (serverResponse.data !== null) {
            //the response from Tatum
            const referenceId = serverResponse.data.reference;
            //DONE
            //POST TRX HISTORY WITH THE USER DATA IN DB
            const newTinqfiTrxn = {
              userEmail: req.user.email,
              userTaTumId: req.user.ourCustomerTatumId,
              transactionAmount: req.body.amount,
              transactionToken: "BSC",
              transactionType: "Invest",
              from: senderBscAccountId,
              to: process.env.TINQFI_INVESTMENT_ACCOUNT_BSC,
              trxnRefId: referenceId,
            };
            new TinqfiTrxn(newTinqfiTrxn).save().then(() =>
              res.json({
                success: true,
                Message: "Transaction Successful",
                trxnRefId: referenceId,
              })
            );
          } else
            res.status(403).send({
              success: false,
              Message: "Transaction Failed no response",
            });
        })
        .catch((err) => {
          res.status(403).send({
            success: false,
            Message: "Transaction Failed, insufficient balance",
          });
        });
    } catch (e) {
      res.status(503).send({
        success: false,
        Message: "Transaction Failed",
      });
    }
  },
  //INVEST IN TINQFI ETH
  investInTinqFiEth: function (req, res) {
    const userArray = req.user.onRegistrationLedgerAccnts;
    const searchIndex = userArray.find(
      (user) => user.tokenAccountcurrency === "ETH"
    );
    const senderEthAccountId = searchIndex.tokenAccountId;
    const formData = {
      senderAccountId: senderEthAccountId,
      recipientAccountId: process.env.TINQFI_INVESTMENT_ACCOUNT_ETH,
      amount: req.body.amount,
      anonymous: false,
      compliant: false,
      transactionCode: req.user.email,
      paymentId: req.user.ourCustomerTatumId,
      recipientNote: req.body.recipientNote,
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
      //
      axios(options)
        .then((serverResponse) => {
          if (serverResponse.data !== null) {
            //the response from Tatum
            const referenceId = serverResponse.data.reference;
            //DONE
            //POST TRX HISTORY WITH THE USER DATA IN DB
            const newTinqfiTrxn = {
              userEmail: req.user.email,
              userTaTumId: req.user.ourCustomerTatumId,
              transactionAmount: req.body.amount,
              transactionToken: "ETH",
              transactionType: "Invest",
              from: senderEthAccountId,
              to: process.env.TINQFI_INVESTMENT_ACCOUNT_ETH,
              trxnRefId: referenceId,
            };
            new TinqfiTrxn(newTinqfiTrxn).save().then(() =>
              res.json({
                success: true,
                Message: "Transaction Successful",
                trxnRefId: referenceId,
              })
            );
          } else
            res.status(403).send({
              success: false,
              Message: "Transaction Failed no response",
            });
        })
        .catch((err) => {
          res.status(403).send({
            success: false,
            Message: "Transaction Failed, insufficient balance",
          });
        });
    } catch (e) {
      res.status(403).send({
        success: false,
        Message: "Transaction Failed",
      });
    }
  },
  //INVEST IN TINQFI DOGE
  investInTinqFiDoge: function (req, res) {
    const userArray = req.user.onRegistrationLedgerAccnts;
    const searchIndex = userArray.find(
      (user) => user.tokenAccountcurrency === "DOGE"
    );
    const senderDogeAccountId = searchIndex.tokenAccountId;
    const formData = {
      senderAccountId: senderDogeAccountId,
      recipientAccountId: process.env.TINQFI_INVESTMENT_ACCOUNT_DOGE,
      amount: req.body.amount,
      anonymous: false,
      compliant: false,
      transactionCode: req.user.email,
      paymentId: req.user.ourCustomerTatumId,
      recipientNote: req.body.recipientNote,
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
      //
      axios(options)
        .then((serverResponse) => {
          if (serverResponse.data !== null) {
            //the response from Tatum
            const referenceId = serverResponse.data.reference;
            //DONE
            //POST TRX HISTORY WITH THE USER DATA IN DB
            const newTinqfiTrxn = {
              userEmail: req.user.email,
              userTaTumId: req.user.ourCustomerTatumId,
              transactionAmount: req.body.amount,
              transactionToken: "DOGE",
              transactionType: "Invest",
              from: senderDogeAccountId,
              to: process.env.TINQFI_INVESTMENT_ACCOUNT_DOGE,
              trxnRefId: referenceId,
            };
            new TinqfiTrxn(newTinqfiTrxn).save().then(() =>
              res.json({
                success: true,
                Message: "Transaction Successful",
                trxnRefId: referenceId,
              })
            );
          } else
            res.status(403).send({
              success: false,
              Message: "Transaction Failed no response",
            });
        })
        .catch((err) => {
          res.status(403).send({
            success: false,
            Message: "Transaction Failed, insufficient balance",
          });
        });
    } catch (e) {
      res.status(500).send({
        success: false,
        Message: "Transaction Failed",
      });
    }
  },
};

module.exports = functions;
