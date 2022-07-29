var Loan = require("../models/Loan");

var functions = {
  //GET LOAN PARAMS FROM DB
  getLoanParams: function (req, res) {
    const loanToken = req.body.token;
    let uppercaseLoanToken = loanToken.toUpperCase();
    console.log(process.env["TINQFI_LOAN_ACCOUNT_" + uppercaseLoanToken]);
    const newLoan = {
      userEmail: "requseremail@gmail.com",
      ourCustomerTatumId: "req.user.ourCustomerTatumId",
      borrowedToken: "ddd",
      borrowedTokenAccount: "sss",
      borrowedAmount: 0,
      collateralToken: "ddd",
      collateralTokenAccount: "ssss",
      collateralAmount: 0,
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
        Message: "Transaction Successful",
      });
    });
  },
  //APPLY FOR lOAN
  applyForLoan: async function (req, res) {
    //get the token from user
    const userArray = await req.user.onRegistrationLedgerAccnts;
    const borrowedToken = req.body.borrowedToken;
    const collateralToken = req.body.collateralToken;
    //GET THE AMOUNT FROM THE USER
    const loanAmount = req.body.loanAmount;
    const collateralAmount = req.body.collateralAmount;
    //CONVERT THEM TO UPPERCASE
    let borrowedLoanToken = borrowedToken.toUpperCase();
    let collateralLoanToken = collateralToken.toUpperCase();
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
            const senderTokenAccountId = collateralSearchIndex.tokenAccountId;
            const formUserMoneyData = {
              recipientAccountId: senderTokenAccountId,
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
                // const newLoan = {
                //   userEmail: req.user.email,
                //   userTaTumId: req.user.ourCustomerTatumId,
                //   borrowedToken: "",
                //   borrowedTokenAccount: "",
                //   borrowedAmount: 0,
                //   collateralToken: "",
                //   collateralTokenAccount: "",
                //   collateralAmount: 0,
                //   initialLTV: "",
                //   marginCall: "",
                //   liquidationLTV: "",
                //   dailyRate: "",
                //   totalRate: "",
                //   repaymentAmount: ""

                // };
                // new Loan(newLoan).save().then(() => {});

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
                    Message: "Transaction Successful",
                    trxnRefId: referenceId + " - " + userReferenceId,
                  })
                );
              });
            } catch (error) {}
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

  //get all loan
  getLoan: function (req, res) {},
  //select a loan
  selectLoan: function (req, res) {},
  //repay a loan
  repayLoan: function (req, res) {},
  //top up a loan colla
  topupLoan: function (req, res) {},
};

module.exports = functions;
