var Convert = require("../models/Convert");
const axios = require("axios");
var TinqfiTrxn = require("../models/Transaction");

var functions = {
  convert: async function (req, res) {
    try {
      //get the required parameters
      const userTokenArray = await req.user.onRegistrationLedgerAccnts;
      const userEmail = req.user.email;
      const userTatumId = req.user.ourCustomerTatumId;
      const fromToken = req.body.fromToken;
      const toToken = req.body.toToken;
      const fromValue = req.body.fromValue;
      //CONVERT THE TOKENS TO UPPERCASE
      let fromUppercaseToken = fromToken.toUpperCase();
      let toUppercaseToken = toToken.toUpperCase();
      //get the token price from coingecko
      const geckoUrl = process.env.PRICE_API;
      const options = {
        method: "GET",
        url: geckoUrl,
      };
      //do something with the response object from coinGecko
      axios(options).then(async (geckoResponse) => {
        if (geckoResponse) {
          const responseFromGecko = await geckoResponse.data;
          //rearrange the response object
          const priceData = {
            BTC: responseFromGecko.bitcoin.usd,
            ETH: responseFromGecko.ethereum.usd,
            BSC: responseFromGecko.binancecoin.usd,
            DOGE: responseFromGecko.dogecoin.usd,
          };
          //DO THE DOLLAR CALCULATIONS HERE
          const fromValueInDollar =
            Number(priceData[fromUppercaseToken]) * Number(fromValue);
          //fee to take
          let trxnFee = (10 / 100) * Number(fromValueInDollar); //ten percent here
          //value to send to user
          //get the dollar value of the toValue
          const toValueInDollar = fromValueInDollar;
          const toValueBeforeFee =
            toValueInDollar / Number(priceData[toUppercaseToken]);
          const toValueInDollarAfterFee = toValueInDollar - trxnFee;
          const toValueAfterFee =
            toValueInDollarAfterFee / Number(priceData[toUppercaseToken]);

          //stop the transaction if its too high
          if (toValueInDollar > fromValueInDollar) {
            res.status(503).send({
              success: false,
              msg: "Cannot complete transaction, price impact error",
            });
          } else {
            //SEARCH TO GET THE USER TOKEN ACCOUNT
            const searchFromIndex = await userTokenArray.find(
              (user) => user.tokenAccountcurrency === fromUppercaseToken
            );
            const fromTokenId = searchFromIndex.tokenAccountId;
            const searchToIndex = await userTokenArray.find(
              (user) => user.tokenAccountcurrency === toUppercaseToken
            );
            const toTokenId = searchToIndex.tokenAccountId;
            //create the convert data object inside the db
            const newConvertData = {
              userEmail,
              userTatumId,
              fromTokenAccount: fromTokenId,
              toTokenAccount: toTokenId,
              fromToken: fromUppercaseToken,
              toToken: toUppercaseToken,
              fromValue,
              toValue: toValueAfterFee,
              fromValueInUsd: fromValueInDollar,
              toValueInUsd: toValueInDollarAfterFee,
              toValueInUsdBeforeFee: toValueInDollar,
              toValueBeforeFee: toValueBeforeFee,
              feeTo: "TinqFi Loan account",
              fee: "10%",
            };
            new Convert(newConvertData).save().then((createdData) => {
              //debit the user and post a transaction data
              const formUserData = {
                recipientAccountId:
                  process.env["TINQFI_LOAN_ACCOUNT_" + fromUppercaseToken],
                senderAccountId: fromTokenId,
                amount: String(fromValue),
                anonymous: false,
                compliant: false,
                transactionCode: req.user.email,
                paymentId: req.user.ourCustomerTatumId,
                recipientNote: "convert from user to tinqfi",
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
                  data: formUserData,
                };
                //DONE
                axios(options).then((serverUserResponse) => {
                  if (serverUserResponse.data.reference) {
                    //update the db and post transaction
                    const data = Convert.updateOne(
                      {
                        _id: createdData._id,
                      },
                      {
                        $set: {
                          toTinqFiAccount: true,
                        },
                      }
                    ).then(() => {
                      //post transaction for the debit
                      const newTinqfiTrxn = {
                        userEmail: req.user.email,
                        userTaTumId: req.user.ourCustomerTatumId,
                        transactionAmount: fromValue,
                        transactionToken: `Converted - ${
                          fromValue + " " + fromUppercaseToken
                        } at ${priceData[fromUppercaseToken]}- to - ${
                          toValueAfterFee + " " + toUppercaseToken
                        } at ${priceData[toUppercaseToken]}`,
                        transactionType: "Convert",
                        tenure: "Instant",
                        from: fromTokenId,
                        to: "To Tinqfi",
                        debit: true,
                        trxnRefId:
                          serverUserResponse.data.reference + " - " + " ",
                      };
                      new TinqfiTrxn(newTinqfiTrxn).save();
                      //here now
                      //send from tinqfi to user after removing fees
                      const formTinqfiData = {
                        recipientAccountId: toTokenId,
                        senderAccountId:
                          process.env[
                            "TINQFI_LOAN_ACCOUNT_" + toUppercaseToken
                          ],
                        amount: String(toValueAfterFee),
                        anonymous: false,
                        compliant: false,
                        transactionCode: req.user.email,
                        paymentId: req.user.ourCustomerTatumId,
                        recipientNote: "convert from tinqfi to user ",
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
                          data: formTinqfiData,
                        };
                        //DONE
                        axios(options).then((serverTinqfiResponse) => {
                          if (serverTinqfiResponse.data.reference) {
                            //update the db and post transaction
                            const data = Convert.updateOne(
                              {
                                _id: createdData._id,
                              },
                              {
                                $set: {
                                  toUserAccount: true,
                                },
                              }
                            ).then(() => {
                              //post transaction for the credit to user
                              const newTinqfiTrxn = {
                                userEmail: req.user.email,
                                userTaTumId: req.user.ourCustomerTatumId,
                                transactionAmount: toValueAfterFee,
                                transactionToken: `Converted - ${
                                  fromValue + " " + fromUppercaseToken
                                } at ${priceData[fromUppercaseToken]}- to - ${
                                  toValueAfterFee + " " + toUppercaseToken
                                } at ${priceData[toUppercaseToken]}`,
                                transactionType: "Convert",
                                tenure: "Instant",
                                from: "From Tinqfi",
                                to: toTokenId,
                                debit: false,
                                trxnRefId:
                                  serverUserResponse.data.reference +
                                  " - " +
                                  serverTinqfiResponse.data.reference,
                              };
                              new TinqfiTrxn(newTinqfiTrxn).save().then(() => {
                                res.status(200).send({
                                  success: true,
                                  msg: `Conversion Successful, ${toUppercaseToken} transferred to your wallet`,
                                });
                              });
                            });
                          } else {
                            res.status(503).send({
                              success: false,
                              msg: "Transaction failed, insufficient balance",
                            });
                          }
                        });
                      } catch (e) {
                        res.status(503).send({
                          success: false,
                          msg: "Transaction failed, insufficient balance from converter",
                        });
                      }
                    });
                  } else {
                    res.status(503).send({
                      success: false,
                      msg: "Transaction failed, insufficient balance",
                    });
                  }
                });
              } catch (error) {
                res.status(503).send({
                  success: false,
                  msg: "Cannot complete transaction, price impact error",
                });
              }
            });
          }
        } else {
          res.status(404).send({
            success: false,
            msg: "Error generating token price, please try again",
          });
        }
      });
    } catch (e) {
      res.status(500).send({
        success: false,
        msg: "A server error occurred while processing your request",
      });
    }
  },
};

module.exports = functions;
