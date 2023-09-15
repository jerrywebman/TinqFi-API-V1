var TinqfiTrxn = require("../../models/Transaction");
const axios = require("axios");
var Otp = require("../../models/Otp");
var bcrypt = require("bcrypt");
var User = require("../../models/user");
const generateOTP = require("../../middleware/generateOTP");
const emailTemplate = require("../../middleware/emailTemplate");
const formatAmount = require("../../utils/index")
const formatAmountInUsd = require("../../utils/formatUsd")

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

      if (process.env.BTC_STOP_WITHDRAWAL === true) {
        res.status(503).send({
          success: false,
          msg: "Bitcoin withdrawal is paused, maintenance ongoing",
        });
      } else if (senderBtcAccountIdFromDb === senderAccountId) {
        //get the ammount and the address of the user
        const address = req.body.address;
        const amount = req.body.amount;
        const senderNote = req.body.senderNote || "No note";

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
        console.log(formData);
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
                debit: true,
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
              res.status(401).send({
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
        res.status(403).send({
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

      if (process.env.ETH_STOP_WITHDRAWAL === true) {
        res.status(503).send({
          success: false,
          msg: "Ethereum withdrawal is paused, maintenance ongoing",
        });
      } else if (senderEthAccountIdFromDb === senderAccountId) {
        //get the ammount and the address of the user
        const address = req.body.address;
        const amount = req.body.amount;
        const senderNote = req.body.senderNote || "No note";

        //hit the tatum api
        const url = `${process.env.TATUM_BASE_URL}/offchain/ethereum/transfer`;
        const formData = {
          address,
          amount: String(amount),
          senderAccountId,
          signatureId: process.env.TATUM_ETH_SIGNATURE_ID,
          senderNote,
        };
        console.log(formData);
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
                debit: true,
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

      if (process.env.BSC_STOP_WITHDRAWAL === true) {
        res.status(503).send({
          success: false,
          msg: "Binance Smart Chain withdrawal is paused, maintenance ongoing",
        });
      } else if (senderBscAccountIdFromDb === senderAccountId) {
        //get the ammount and the address of the user
        const address = req.body.address;
        const amount = req.body.amount;
        const senderNote = req.body.senderNote || "No note ";

        //hit the tatum api
        const url = `${process.env.TATUM_BASE_URL}/offchain/bsc/transfer`;
        const formData = {
          address,
          amount: String(amount),
          senderAccountId,
          signatureId: process.env.TATUM_BSC_SIGNATURE_ID,
          senderNote,
        };
        console.log(formData);
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
                debit: true,
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

      if (process.env.DOGE_STOP_WITHDRAWAL === true) {
        res.status(503).send({
          success: false,
          msg: "Dogecoin withdrawal is paused, maintenance ongoing",
        });
      } else if (senderDogeAccountIdFromDb === senderAccountId) {
        //get the ammount and the address of the user
        const address = req.body.address;
        const amount = req.body.amount;
        const senderNote = req.body.senderNote || "No note";

        //hit the tatum api
        const url = `${process.env.TATUM_BASE_URL}/offchain/dogecoin/transfer`;
        const formData = {
          address,
          amount: String(amount),
          senderAccountId,
          signatureId: process.env.TATUM_DOGE_SIGNATURE_ID,
          senderNote,
          xpub: process.env.DOGE_XPUB,
        };
        console.log(formData);
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
                debit: true,
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

  //SEND OTP
  sendOtp: async function (req, res) {
    try {
      const generatedOTP = generateOTP();
      const userInfo = await Otp.findOne({ userEmail: req.user.email });
      //hashing the otp
      bcrypt.genSalt(10, function (err, salt) {
        if (err) {
          return next(err);
        }
        bcrypt.hash(generatedOTP, salt, async function (err, hash) {
          if (err) {
            return next(err);
          }
          else {
            //if a document exist, just update it
            if (userInfo) {
              const updatedOTP = await Otp.updateOne(
                { userEmail: req.user.email },
                {
                  $set: {
                    verifyCode: hash,
                    createdAt: Date.now()
                  },
                }
              ).then(() => {
                emailTemplate.verifyWithdrawal(generatedOTP, req.user.email);
                res.json({
                  success: true,
                  msg: "Please check your email address for the OTP",
                });
              });

            } else {
              const newOTP = Otp({
                userEmail: req.user.email,
                verifyCode: generatedOTP,
              })

              newOTP.save(function (err, data) {
                if (err) {
                  res.status(401).send({
                    success: false,
                    msg: `error occurred ${err}`
                  })
                } else {
                  emailTemplate.verifyWithdrawal(generatedOTP, req.user.email);
                  res.json({
                    success: true,
                    msg: "Please check your email address for the OTP",
                  });
                }
              })
            }
          }
        });
      });
    } catch (e) {
      res.status(500).send({
        success: false,
        msg: `server unavailable ${e.message}`
      })
    }
  },

  //COMPLETE WITHDRAWAL
  completeWithdrawal: async function (req, res) {
    try {
      const code = req.body.code;
      const pin = req.body.pin;
      let userOtp = await Otp.findOne({ userEmail: req.user.email });
      let user = await User.findOne({ email: req.user.email });
      const timeDiff = userOtp.createdAt - Date.now();
      //600 is 10 minutes in seconds
      if (userOtp && timeDiff < 600) {
        //compareCode is a method in the otp model
        userOtp.compareCode(code, function (err, isMatch) {
          //COMPARING THE OTP
          if (isMatch && err === null) {
            //COMPARING THE USER PIN
            user.comparePin(pin, function (err, isOk) {
              //COMPARING THE PIN
              if (isOk && err === null) {
                //delete the OTP document and send a true status message
                const deletedOTP = Otp.deleteOne({ userEmail: req.user.email }).then(() => res.send({
                  success: true,
                  msg: "OTP and pin verified successfully"
                }))
              } else {
                return res.status(401).send({
                  success: false,
                  msg: "Something went wrong, Please try again or request a new OTP",
                });
              }
            });

          } else {
            return res.status(401).send({
              success: false,
              msg: "Something went wrong, Please try again or request a new OTP",
            });
          }
        });
      }
      else {
        res.status(401).send({
          sucess: false,
          msg: "Please request a new OTP, OTP expires after 10 minutes"
        })
      }
    } catch (e) {
      res.status(500).send({
        success: false,
        msg: `Server error: ${e.message}`
      })
    }
  },
};

module.exports = functions;
