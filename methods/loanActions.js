var Loan = require("../models/Loan");
var LoanLTV = require("../models/LoanLTV");
const axios = require("axios");
var TinqfiTrxn = require("../models/Transaction");

var functions = {
  //SELECT A LOAN DATA DONE
  selectLoanData: async function (req, res) {
    try {
      const loanToken = req.query.loanToken;
      const uppercaseLoanToken = loanToken.toUpperCase();
      //GETTING DATA FROM COINGECKO
      const geckoUrl =
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Cdogecoin%2Cbinancecoin&vs_currencies=usd";
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
          let theLoan = await LoanLTV.findOne({ _id: uppercaseLoanToken });
          if (!theLoan) {
            res.status(400).send({
              success: false,
              msg: `Failed to retrieve loan data for the token ${uppercaseLoanToken}`,
            });
          } else {
            let tokensFromGecko = { ...theLoan._doc, ...priceData };
            res.status(200).send({
              success: true,
              msg: "Data Retrieved successfully",
              data: tokensFromGecko,
            });
          }
        } else
          res.status(404).send({
            success: false,
            msg: "Market data error",
          });
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        success: false,
        msg: "An Internal Server Error Occurred",
      });
    }
  },

  //APPLY FOR lOAN DONE
  applyForLoan: async function (req, res) {
    try {
      //GET THE USER LEDGER ACCOUNTS AND TOKENS TO WORK WITH
      const userArray = await req.user.onRegistrationLedgerAccnts;
      const borrowedToken = req.body.borrowedToken;
      const collateralToken = req.body.collateralToken;
      const loanTenure = req.body.loanTenure;

      //GET THE AMOUNT FROM THE USER
      const borrowedAmount = req.body.borrowedAmount;

      //GETTING THE DATE TO END THE lOAN PLAN
      const aDayInMilliseconds = 86400000; //24 * 60 * 60 * 1000
      const today = Date.now();
      const closingDate = Date.now() + aDayInMilliseconds * Number(loanTenure);

      //CONVERT THE TOKENS TO UPPERCASE
      let borrowedLoanToken = borrowedToken.toUpperCase();
      let collateralLoanToken = collateralToken.toUpperCase();
      //GETTING DATA FROM COINGECKO
      const geckoUrl =
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Cdogecoin%2Cbinancecoin&vs_currencies=usd";
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
          let theLoan = await LoanLTV.findOne({ _id: borrowedLoanToken });
          if (!theLoan) {
            res.status(400).send({
              success: false,
              msg: `Failed to retrieve loan data for the token ${borrowedLoanToken}`,
            });
          } else {
            let tokensPriceAndLoandata = { ...theLoan._doc, ...priceData };
            //GET THE PRICE OF THE BORROWED TOKEN IN USD
            const borrowedAmountInUsd =
              tokensPriceAndLoandata[borrowedLoanToken] * borrowedAmount;
            //STORE THE BALANCE LTV
            const balLtv = 100 - tokensPriceAndLoandata.initialLTV;
            //GET THE PRICE OF THE COLLATERAL TOKEN IN USD
            const collateralAmountInUsd =
              borrowedAmountInUsd * (balLtv / 100) + borrowedAmountInUsd;

            // calculate to know how much collateral to collect in value
            const collateralAmountInValue =
              collateralAmountInUsd /
              tokensPriceAndLoandata[collateralLoanToken];

            //INTEREST RATE IN USD
            const dailyInterestToPayInUsd =
              borrowedAmountInUsd *
              (tokensPriceAndLoandata.dailyInterestRate / 100);

            //INTEREST TO PAY IN VALUE
            const dailyInterestToPayInValue =
              borrowedAmount * (tokensPriceAndLoandata.dailyInterestRate / 100);

            //TOTAL INTEREST TO PAY IN USD
            const totalInterestToPayInUsd =
              dailyInterestToPayInUsd * Number(loanTenure);
            //TOTAL INTEREST TO PAY IN VALUE
            const totalInterestToPayInValue =
              dailyInterestToPayInValue * Number(loanTenure);
            // send to the next stage
            //SEARCH TO GET THE USER TOKEN ACCOUNT
            const searchIndex = await userArray.find(
              (user) => user.tokenAccountcurrency === collateralLoanToken
            );
            const senderTokenAccountId = searchIndex.tokenAccountId;
            //COLLECT THE COLLATERAL FROM THE USER TO TINQFI_LOAN_ACCOUNT_
            const formUserMoneyData = {
              senderAccountId: senderTokenAccountId,
              recipientAccountId:
                process.env["TINQFI_LOAN_ACCOUNT_" + collateralLoanToken],
              amount: String(collateralAmountInValue),
              anonymous: false,
              compliant: false,
              transactionCode: req.user.email,
              paymentId: req.user.ourCustomerTatumId,
              recipientNote: "collateralAmount to TinqFi",
            };
            const url = `${process.env.TATUM_BASE_URL}/ledger/transaction`;
            //MAKE THE POST REQUEST TO TINQFI
            try {
              const options = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-api-key": process.env.TATUM_API_KEY,
                },
                url,
                data: formUserMoneyData,
              };
              //step 2
              axios(options)
                .then((serverResponse) => {
                  if (serverResponse.data.reference !== null) {
                    //post a transaction debit
                    const newTinqfiTrxn = {
                      userEmail: req.user.email,
                      userTaTumId: req.user.ourCustomerTatumId,
                      transactionAmount: collateralAmountInValue,
                      transactionToken: ` ${collateralLoanToken} as Collateral at ${tokensPriceAndLoandata[collateralLoanToken]}`,
                      transactionType: "Loan",
                      tenure: `${loanTenure} days`,
                      from: "Wallet",
                      to: "Tinqfi",
                      debit: true,
                      trxnRefId: serverResponse.data.reference,
                    };
                    new TinqfiTrxn(newTinqfiTrxn).save();
                    //the response from Tatum
                    const collateralReferenceId = serverResponse.data.reference;
                    //SENDING THE TOKEN TO THE USER FROM TINQFI_LOAN_ACCOUNT
                    const collateralSearchIndex = userArray.find(
                      (user) => user.tokenAccountcurrency === borrowedLoanToken
                    );
                    //GET THE USER BORROWED TOKEN ID
                    const recieverBorrowedTokenAccountId =
                      collateralSearchIndex.tokenAccountId;
                    const formTinqfiMoneyData = {
                      recipientAccountId: recieverBorrowedTokenAccountId,
                      senderAccountId:
                        process.env["TINQFI_LOAN_ACCOUNT_" + borrowedLoanToken],
                      amount: String(borrowedAmount),
                      anonymous: false,
                      compliant: false,
                      transactionCode: req.user.email,
                      paymentId: req.user.ourCustomerTatumId,
                      recipientNote: "borrowed token to User",
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
                        data: formTinqfiMoneyData,
                      };
                      //DONE
                      axios(options).then((serverUserResponse) => {
                        if (serverUserResponse.data.reference) {
                          const borrowedTokenReferenceId =
                            serverUserResponse.data.reference;
                          //CREATE A NEW LOAN OBJECT
                          const newLoan = {
                            userEmail: req.user.email,
                            ourCustomerTatumId: req.user.ourCustomerTatumId,
                            borrowedToken: borrowedLoanToken,
                            borrowedTokenAccount:
                              recieverBorrowedTokenAccountId,
                            borrowedAmountInValue: Number(borrowedAmount),
                            borrowedTokenAmountInUsd:
                              Number(borrowedAmountInUsd),
                            borrowedTatumRefID: borrowedTokenReferenceId,
                            initialBorrowedTokenPrice: Number(
                              tokensPriceAndLoandata[borrowedLoanToken]
                            ),
                            collateralToken: collateralLoanToken,
                            collateralTokenAccount: senderTokenAccountId,
                            collateralAmountInValue: Number(
                              collateralAmountInValue
                            ),
                            collateralTokenAmountInUsd: Number(
                              collateralAmountInUsd
                            ),
                            collateralTatumRefID: collateralReferenceId,
                            initialCollateralTokenPrice: Number(
                              tokensPriceAndLoandata[collateralLoanToken]
                            ),
                            dailyInterestRateOnPlan: Number(
                              tokensPriceAndLoandata.dailyInterestRate
                            ),
                            initialLTV: tokensPriceAndLoandata.initialLTV,
                            marginCall: tokensPriceAndLoandata.marginCall,
                            liquidationLTV:
                              tokensPriceAndLoandata.liquidationLTV,
                            dailyInterestToPayInUsd,
                            dailyInterestToPayInValue,
                            totalInterestRateInUsd: totalInterestToPayInUsd,
                            totalInterestToPayInValue,
                            loanTenure,
                            repaymentAmountInValue:
                              totalInterestToPayInValue +
                              Number(borrowedAmount), //amount to payback + interest
                            topupLoan: collateralAmountInValue,
                            endAt: closingDate,
                            status: true,
                          };
                          new Loan(newLoan).save().then(() => {
                            //POST TRX HISTORY WITH THE USER DATA IN DB
                            const newTinqfiTrxn = {
                              userEmail: req.user.email,
                              userTaTumId: req.user.ourCustomerTatumId,
                              transactionAmount: borrowedAmount,
                              transactionToken: `Bowwered -${borrowedLoanToken} at ${tokensPriceAndLoandata[borrowedLoanToken]}- with - ${collateralLoanToken} at ${tokensPriceAndLoandata[collateralLoanToken]} as collateral`,
                              transactionType: "Loan",
                              tenure: `${loanTenure} days`,
                              from: "From TinqFI",
                              to: senderTokenAccountId,
                              debit: false,
                              trxnRefId:
                                collateralReferenceId +
                                " - " +
                                borrowedTokenReferenceId,
                            };
                            new TinqfiTrxn(newTinqfiTrxn).save();
                            res.json({
                              success: true,
                              msg: "Loan Approved ",
                            });
                          });
                        } else {
                          res.status(403).send({
                            success: false,
                            msg: "Transaction Failed while sending Loan Token to user",
                          });
                        }
                      });
                    } catch (error) {}
                  } else
                    res.status(403).send({
                      success: false,
                      msg: "Transaction Failed no response",
                    });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(403).send({
                    success: false,
                    msg: "Transaction Failed, insufficient balance",
                  });
                });
            } catch (e) {
              res.status(500).send({
                success: false,
                msg: "Transaction Failed",
              });
            }
          }
        } else
          res.status(404).send({
            success: false,
            msg: "Market data error",
          });
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        msg: err,
      });
    }
  },

  //GET ALL USER LOANS DONE
  getAllUserLoan: async function (req, res) {
    try {
      const loanData = await Loan.find({
        userEmail: req.user.email,
        status: true,
      }).sort({ createdAt: -1 });
      res.json({
        success: true,
        msg: "Loan data successfully fetched",
        data: loanData,
      });
    } catch (err) {
      res.status(403).send({
        success: false,
        msg: "Unable to get loan data",
      });
    }
  },

  //top up a loan collateral add the trxn data
  topupCollateral: async function (req, res) {
    try {
      //get the loan data from db
      const theLoan = await Loan.findOne({
        _id: req.params.id,
        userEmail: req.user.email,
        status: true,
      });
      console.log(theLoan);
      if (!theLoan) {
        res.status(403).send({
          success: false,
          msg: "Loan is inactive/not available",
        });
      } else {
        //check for the current price of the collateral
        //GETTING DATA FROM COINGECKO
        const geckoUrl =
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Cdogecoin%2Cbinancecoin&vs_currencies=usd";
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

            // console.log("priceData", priceData);
            //get the price of collateral token
            const currentCollateralPriceInUsd =
              priceData[theLoan.collateralToken] *
              theLoan.collateralAmountInValue;
            // console.log(
            //   "currentCollateralPriceInUsd",
            //   currentCollateralPriceInUsd
            // );
            //get the margin call data
            const checkMarginCall =
              theLoan.collateralTokenAmountInUsd * (theLoan.marginCall / 100);
            // console.log("checkMarginCall", checkMarginCall);
            //get the liquidation call data
            const checkLiquidationCall =
              theLoan.collateralTokenAmountInUsd * (80 / 100); //theLoan.liquidationLTV
            // console.log("checkLiquidationCall", checkLiquidationCall);
            //get the price of collateral token

            if (checkLiquidationCall <= currentCollateralPriceInUsd) {
              //end the loan plan and send the user and tinqfi an email notification
              console.log(
                "end the loan plan and send the user and tinqfi an email notification"
              );
            }
            if (checkMarginCall <= currentCollateralPriceInUsd) {
              console.log("Topup the loan");
              //add a new amount to the topup array
            }
            if (
              currentCollateralPriceInUsd >= theLoan.collateralTokenAmountInUsd
            ) {
              console.log("no need to topup");
              //add a new amount to the topup array
            }
          } else {
            res
              .status(400)
              .send({ success: false, msg: "Failed market data response" });
          }
          //determine how many more collateral to take
          //collect the collateral and add to the topup
        });
      }
    } catch (e) {
      res.status(500).send({
        success: false,
        msg: "A server error occurred while processing your request",
      });
    }
  },

  //repay a loan complete this
  repayLoan: async function (req, res) {
    try {
      //get the loan data from db
      const theLoan = await Loan.findOne({
        _id: req.params.id,
        userEmail: req.user.email,
        status: true,
      });
      console.log(theLoan);
      if (!theLoan) {
        res.status(403).send({
          success: false,
          msg: "Loan is inactive/not available",
        });
      } else {
        res.json({
          success: true,
          loan: theLoan,
        });
        //do something with the loan data
        var topupArray = theLoan.topupLoan;
        var topupSum = 0;
        //get the sum of the topup arrays
        for (var i in topupArray) {
          topupSum += topupArray[i];
        }
        console.log(topupSum);

        //get the daily interest rate and calculate the interest rate for the loan
        const aDayInMilliseconds = 86400000; //24 * 60 * 60 * 1000
        const today = Date.now();
        const createdAt = new Date(theLoan.createdAt);
        const dateDiff = today - createdAt;
        const days = dateDiff / aDayInMilliseconds;
        const totalInterest =
          Math.ceil(days) * theLoan.dailyInterestToPayInValue;
        console.log(totalInterest);
        //THE AMOUNT + THE PROFIT
        const borrowedTokenAndProfit =
          totalInterest + theLoan.borrowedAmountInValue;
        console.log(borrowedTokenAndProfit);
        //COLLECT THE LOAN BORROWED TOKEN TO THE USER
        const borrowedTokenData = {
          recipientAccountId:
            process.env["TINQFI_LOAN_ACCOUNT_" + theLoan.borrowedToken],
          senderAccountId: theLoan.borrowedTokenAccount,
          amount: String(borrowedTokenAndProfit),
          anonymous: false,
          compliant: false,
          transactionCode: req.user.email,
          paymentId: req.user.ourCustomerTatumId,
          recipientNote: "borrowed token to TinqFi + Profit",
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
            data: borrowedTokenData,
          };
          //DONE
          axios(options)
            .then(async (serverUserResponse) => {
              if (serverUserResponse.data.reference !== null) {
                //the response from Tatum
                const borrowedTokenRefId = await serverUserResponse.data
                  .reference;
                //COLLECT THE COLLATERAL FROM TINQFI
                const collateralTokenData = {
                  recipientAccountId: theLoan.collateralTokenAccount,
                  senderAccountId:
                    process.env[
                      "TINQFI_LOAN_ACCOUNT_" + theLoan.collateralToken
                    ],
                  amount: String(topupSum),
                  anonymous: false,
                  compliant: false,
                  transactionCode: req.user.email,
                  paymentId: req.user.ourCustomerTatumId,
                  recipientNote: "all collateral token to user",
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
                    data: collateralTokenData,
                  };
                  //DONE
                  axios(options).then(async (serverTinqFiResponse) => {
                    if (serverTinqFiResponse !== null) {
                      //the response from Tatum
                      const collateralTokenRefId = await serverTinqFiResponse
                        .data.reference;

                      //set the loan as inactive
                      const updateLoan = await Loan.updateOne(
                        {
                          _id: req.params.id,
                          userEmail: req.user.email,
                          status: true,
                        },
                        {
                          $set: {
                            status: false,
                          },
                        }
                      ).then(() => {
                        //POST TRX HISTORY WITH THE USER DATA IN DB
                        const newTinqfiTrxn = {
                          userEmail: req.user.email,
                          userTaTumId: req.user.ourCustomerTatumId,
                          transactionAmount: borrowedTokenAndProfit,
                          transactionToken: `Repayed -${borrowedTokenAndProfit} as loan + Profit with loan Id ${theLoan._id} and collected Collateral`,
                          transactionType: "Loan",
                          tenure: `${Math.ceil(days)} days`,
                          from: "From TinqFI + User",
                          to: theLoan.collateralTokenAccount,
                          debit: true,
                          trxnRefId:
                            collateralTokenRefId + " - " + borrowedTokenRefId,
                        };
                        new TinqfiTrxn(newTinqfiTrxn).save();
                        res.json({
                          success: true,
                          msg: "Loan Repayed successfully",
                        });
                      });
                    } else {
                      res.status(401).send({
                        success: false,
                        msg: "Transaction Failed no responses",
                      });
                    }
                  });
                } catch (error) {
                  //the error from axios
                }
              } else {
                res.status(401).send({
                  success: false,
                  msg: "Transaction Failed no responsess",
                });
              }
            })
            .catch((error) => {
              res.status(401).send({
                success: false,
                msg: "Transaction Failed no responses",
              });
            });
        } catch (e) {
          res.status(401).send({
            success: false,
            msg: "Transaction Failed no responses",
          });
        }
      }
    } catch (e) {
      res.status(500).send({
        success: false,
        msg: "A server error occurred while processing your request",
      });
    }
  },

  //SELECT A SPECIFIC LOANS
  selectALoan: async function (req, res) {
    try {
      const loanParams = await Loan.findOne({
        _id: req.params.id,
        userEmail: req.user.email,
        status: true,
      });
      if (loanParams === null) {
        res.json({
          success: false,
          msg: "Loan not found",
        });
      } else {
        res.json({
          success: true,
          data: loanParams,
          msg: "Loan successfully fetched",
        });
      }
    } catch (e) {
      res.status(404).send({
        success: false,
        msg: "No Loan Found with that ID",
      });
    }
  },

  //add a loan params DONE
  addLoanParams: function (req, res) {
    try {
      const newLoanLTV = {
        _id: "DOGE",
        dailyInterestRate: 0.1, //dailyinterest rate
        initialLTV: 60, //60% of collateralTone. we give the user 60% of his collateral token
        marginCall: 75, //  collateralAmount and Value in usd.. chck the initial value in usd by the current price of the token in usd
        liquidationLTV: 70,
        loanTenure: [30, 60, 90, 180],
      };
      new LoanLTV(newLoanLTV).save().then(() => {
        res.json({ success: true, msg: "Loan Saved" });
      });
    } catch (e) {
      res.json({ success: false, msg: e`Error = ${e}` });
    }
  },
};

module.exports = functions;
