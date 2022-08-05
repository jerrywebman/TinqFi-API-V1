var Loan = require("../models/Loan");
var LoanLTV = require("../models/LoanLTV");
const axios = require("axios");

var functions = {
  //add a loan params IN-PROGRESS
  addLoanParams: function (req, res) {
    const newLoanLTV = {
      _id: "BSC",
      totalInterestRate: 0,
      initialLTV: 60,
      marginCall: 65,
      liquidationLTV: 75,
      totalInterestRate: 10,
      loanTenure: [30, 60, 90],
    };
    new LoanLTV(newLoanLTV).save().then(() => {
      res.json({ success: true, msg: "Loan Saved" });
    });
  },
  //APPLY FOR lOAN IN-PROGRESS
  applyForLoan: async function (req, res) {
    //GET THE USER LEDGER ACCOUNTS AND TOKENS TO WORK WITH
    const userArray = await req.user.onRegistrationLedgerAccnts;
    const borrowedToken = req.body.borrowedToken;
    const collateralToken = req.body.collateralToken;

    //GET THE AMOUNT FROM THE USER
    const loanAmount = req.body.loanAmount;
    const collateralAmount = req.body.collateralAmount;

    //CONVERT THE TOKENS TO UPPERCASE
    let borrowedLoanToken = borrowedToken.toUpperCase();
    let collateralLoanToken = collateralToken.toUpperCase();

    //MAKE A REQUEST AND GET THE LPV AND MARGIN CALL ETC
    let loanLTV = await LoanLTV.find({ _id: borrowedLoanToken });
    // _id: "BSC",
    //   totalInterestRate: 0,
    //   initialLTV: 60,
    //   marginCall: 65,
    //   liquidationLTV: 75,
    //   totalInterestRate: 10,
    //   loanTenure: [30, 60, 90],

    //CALCULATE THE COLLATERAL PERCENTAGES
    // get the current_price of btc
    // get the current_price of eth

    // check for the ratio between the current_price of btc and ethereum
    // calculate to know how much collateral to collect
    // send to the next stage

    //SEARCH TO GET THE USER TOKEN ACCOUNT
    const searchIndex = await userArray.find(
      (user) => user.tokenAccountcurrency === collateralLoanToken
    );
    const senderTokenAccountId = searchIndex.tokenAccountId;
    //COLLECT THE COLLATERAL FROM THE USER
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
            const referenceId = serverResponse.data.reference;
            //SENDING THE TOKEN TO THE USER
            const collateralSearchIndex = userArray.find(
              (user) => user.tokenAccountcurrency === borrowedLoanToken
            );
            const recieverBorrowedTokenAccountId =
              collateralSearchIndex.tokenAccountId;
            const formUserMoneyData = {
              recipientAccountId: recieverBorrowedTokenAccountId,
              senderAccountId:
                process.env["TINQFI_LOAN_ACCOUNT_" + borrowedLoanToken],
              amount: Number(loanAmount),
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
                const userReferenceId = serverUserResponse.data.reference;
                //CREATE A NEW LOAN OBJECT
                const newLoan = {
                  userEmail: req.user.email,
                  ourCustomerTatumId: req.user.ourCustomerTatumId,
                  borrowedToken: borrowedLoanToken,
                  borrowedTokenAccount: recieverBorrowedTokenAccountId,
                  borrowedAmount: loanAmount,
                  collateralToken: collateralLoanToken,
                  collateralTokenAccount: senderTokenAccountId,
                  collateralAmount: collateralAmount,
                  initialLTV: 0,
                  marginCall: 0,
                  liquidationLTV: 0,
                  dailyRate: 0,
                  totalRate: 0,
                  loanTenure: Date.now(),
                  repaymentAmount: 0,
                };
                new Loan(newLoan).save().then(() => {
                  res.json({
                    success: true,
                    msg: "Transaction Successful",
                  });
                });

                //POST TRX HISTORY WITH THE USER DATA IN DB
                const newTinqfiTrxn = {
                  userEmail: req.user.email,
                  userTaTumId: req.user.ourCustomerTatumId,
                  transactionAmount: req.body.amount,
                  transactionToken: `Bowwered -${borrowedLoanToken} - with - ${collateralLoanToken} as collateral`,
                  transactionType: "Loan",
                  tenure: req.body.tenure,
                  from: process.env[
                    "TINQFI_LOAN_ACCOUNT_" + uppercaseLoanToken
                  ],
                  to: senderTokenAccountId,
                  trxnRefId: referenceId + " - " + userReferenceId,
                };
                new TinqfiTrxn(newTinqfiTrxn).save().then(() =>
                  res.json({
                    success: true,
                    msg: "Transaction Successful",
                    trxnRefId: referenceId + " - " + userReferenceId,
                  })
                );
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
  },

  //get all loan IN-PROGRESS
  getAllLoan: function (req, res) {},
  //select a loan

  //select a loan DONE
  selectLoan: async function (req, res) {
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
  //repay a loan
  repayLoan: function (req, res) {},
  //top up a loan colla
  topupLoan: function (req, res) {},
};

module.exports = functions;
