var Loan = require("../models/Loan");
var LoanLTV = require("../models/LoanLTV");
const axios = require("axios");

var functions = {
  //add a loan params DONE
  addLoanParams: function (req, res) {
    const newLoanLTV = {
      _id: "BSC",
      totalInterestRate: 10, //yearly interest rate
      initialLTV: 60, //60% of collateralTone. we give the user 60% of his collateral token
      marginCall: 75, //  collateralAmount and Value in usd.. chck the initial value in usd by the current price of the token in usd
      liquidationLTV: 70,
      loanTenure: [30, 60, 90],
    };
    new LoanLTV(newLoanLTV).save().then(() => {
      res.json({ success: true, msg: "Loan Saved" });
    });
  },

  //APPLY FOR lOAN DONE
  applyForLoan: async function (req, res) {
    //GET THE USER LEDGER ACCOUNTS AND TOKENS TO WORK WITH
    const userArray = await req.user.onRegistrationLedgerAccnts;
    const borrowedToken = req.body.borrowedToken;
    const collateralToken = req.body.collateralToken;
    const loanTenure = req.body.loanTenure;

    //GET THE AMOUNT FROM THE USER
    const borrowedAmount = req.body.borrowedAmount;

    //CONVERT THE TOKENS TO UPPERCASE
    let borrowedLoanToken = borrowedToken.toUpperCase();
    let collateralLoanToken = collateralToken.toUpperCase();

    try {
      //GETTING DATA FROM COINGECKO
      const geckoUrl =
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Cdogecoin%2Cbinancecoin&vs_currencies=usd";
      const options = {
        method: "GET",
        url: geckoUrl,
      };
      //do something with the response object from coinGecko
      axios(options).then(async (geckoResponse) => {
        console.log(geckoResponse);
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
            //GET THE PRICE OF THE BORROWED TOKEN IN USD
            const borrowedAmountInUsd =
              tokensPriceAndLoandata.data[borrowedLoanToken] * borrowedAmount;
            //STORE THE BALANCE LTV
            const balLtv = 100 - tokensPriceAndLoandata.data.initialLTV;
            //GET THE PRICE OF THE COLLATERAL TOKEN IN USD
            const collateralAmountInUsd =
              borrowedAmountInUsd * (balLtv / 100) + borrowedAmountInUsd;
            // calculate to know how much collateral to collect
            const collateralAmount =
              collateralAmountInUsd /
              tokensPriceAndLoandata.data[collateralLoanToken];
            //INTEREST RATE
            const interestToPay =
              borrowedAmountInUsd *
              (tokensPriceAndLoandata.data.totalInterestRate / 100);

            // send to the next stage
            //SEARCH TO GET THE USER TOKEN ACCOUNT
            const searchIndex = await userArray.find(
              (user) => user.tokenAccountcurrency === collateralLoanToken
            );
            const senderTokenAccountId = searchIndex.tokenAccountId;
            //COLLECT THE COLLATERAL FROM THE USER TO TINQFI_LOAN_ACCOUNT_
            const formTinqfiMoneyData = {
              senderAccountId: senderTokenAccountId,
              recipientAccountId:
                process.env["TINQFI_LOAN_ACCOUNT_" + collateralLoanToken],
              amount: Number(collateralAmount),
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
                data: formTinqfiMoneyData,
              };
              //step 2
              axios(options)
                .then((serverResponse) => {
                  if (serverResponse.data !== null) {
                    //the response from Tatum
                    const collateralReferenceId = serverResponse.data.reference;
                    //SENDING THE TOKEN TO THE USER FROM TINQFI_LOAN_ACCOUNT
                    const collateralSearchIndex = userArray.find(
                      (user) => user.tokenAccountcurrency === borrowedLoanToken
                    );
                    //GET THE USER BORROWED TOKEN ID
                    const recieverBorrowedTokenAccountId =
                      collateralSearchIndex.tokenAccountId;
                    const formUserMoneyData = {
                      recipientAccountId: recieverBorrowedTokenAccountId,
                      senderAccountId:
                        process.env["TINQFI_LOAN_ACCOUNT_" + borrowedLoanToken],
                      amount: Number(borrowedAmount),
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
                        data: formUserMoneyData,
                      };
                      //DONE
                      axios(options).then((serverUserResponse) => {
                        const borrowedTokenReferenceId =
                          serverUserResponse.data.reference;
                        //CREATE A NEW LOAN OBJECT
                        const newLoan = {
                          userEmail: req.user.email,
                          ourCustomerTatumId: req.user.ourCustomerTatumId,
                          borrowedToken: borrowedLoanToken,
                          borrowedTokenAccount: recieverBorrowedTokenAccountId,
                          borrowedAmount: borrowedAmount,
                          borrowedTokenAmountInUsd: borrowedAmountInUsd,
                          borrowedTatumRefID: borrowedTokenReferenceId,
                          initialBorrowedTokenPrice:
                            tokensPriceAndLoandata.data[borrowedLoanToken],
                          collateralToken: collateralLoanToken,
                          collateralTokenAccount: senderTokenAccountId,
                          collateralAmount: collateralAmount,
                          collateralTokenAmountInUsd: collateralAmountInUsd,
                          collateralTatumRefID: collateralReferenceId,
                          initialCollateralTokenPrice:
                            tokensPriceAndLoandata.data[collateralLoanToken],
                          interestToPay: interestToPay,
                          interestPercentage:
                            tokensPriceAndLoandata.data.totalInterestRate,
                          initialLTV: tokensPriceAndLoandata.data.initialLTV,
                          marginCall: tokensPriceAndLoandata.data.marginCall,
                          liquidationLTV:
                            tokensPriceAndLoandata.data.liquidationLTV,
                          dailyRate: 0,
                          totalRate: 0,
                          loanTenure,
                          repaymentAmount: 0,
                        };
                        new Loan(newLoan).save().then(() => {
                          //POST TRX HISTORY WITH THE USER DATA IN DB
                          const newTinqfiTrxn = {
                            userEmail: req.user.email,
                            userTaTumId: req.user.ourCustomerTatumId,
                            transactionAmount: req.body.amount,
                            transactionToken: `Bowwered -${borrowedLoanToken} at ${tokensPriceAndLoandata.data[borrowedLoanToken]}- with - ${collateralLoanToken} at ${tokensPriceAndLoandata.data[collateralLoanToken]} as collateral`,
                            transactionType: "Loan",
                            tenure: `${loanTenure} days`,
                            from: "From TinqFI",
                            to: senderTokenAccountId,
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
                      });
                    } catch (error) {}
                  } else
                    res.status(403).send({
                      success: false,
                      msg: "Transaction Failed no response",
                    });
                })
                .catch((err) => {
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
          res.status(401).send({
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

  //GET ALL USER LOANS IN-PROGRESS
  getAllUserLoan: async function (req, res) {
    try {
      const loanData = await Loan.find({ userEmail: req.user.email });
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

  //SELECT A LOAN DATA DONE
  selectLoanData: async function (req, res) {
    const loanToken = req.body.loanToken;
    const uppercaseLoanToken = loanToken.toUpperCase();
    try {
      //GETTING DATA FROM COINGECKO
      const geckoUrl =
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Cdogecoin%2Cbinancecoin&vs_currencies=usd";
      const options = {
        method: "GET",
        url: geckoUrl,
      };
      //do something with the response object from coinGecko
      axios(options).then(async (geckoResponse) => {
        console.log(geckoResponse);
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
          res.status(401).send({
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

  //SELECT A SPECIFIC LOANS
  selectALoan: async function (req, res) {
    try {
      const loanParams = await Loan.findOne({
        _id: req.params.id,
      });
      if (loanParams === null) {
        res.json({
          success: false,
          data: loanParams,
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

  //repay a loan
  repayLoan: function (req, res) {},
  //top up a loan colla
  topupLoan: function (req, res) {},
};

module.exports = functions;
