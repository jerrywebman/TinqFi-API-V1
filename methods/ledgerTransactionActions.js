var TinqfiTrxn = require("../models/Transaction");
var User = require("../models/user");
const axios = require("axios");
const getCurrentTokenPrice = require("../utils/getCurrentTokenPrice")

var functions = {
  //MAKE INTERNAL TRANSFER
  makeInternalTransfer: function (req, res) {
    //security checks: min withdrawal, max transfer, check amount,
    // res.send({ success: true, msg: "Internal transfer route" });
    //CHECK THE ADDRESS, IF IN TATUM
    try {
      const currency = req.body.currency;
      const address = req.body.address;
      const tokenAccountId = req.body.tokenAccountId;
      const amount = req.body.amount;
      const amountNumber = Number(amount);
      // console.log(currency, address, amount, tokenAccountId);
      //Check whether a blockchain address is assigned to a user
      const url = `${process.env.TATUM_BASE_URL}/offchain/account/address/${address}/${currency}`;
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
            // console.log(serverResponse.data);
            const recieverTokenAccountId = await serverResponse.data.id;
            const recieverTatumId = await serverResponse.data.customerId;
            //NOW MAKE THE TRANSFER
            const reciever = await User.findOne({ ourCustomerTatumId: recieverTatumId });
            //GET THE EARN TOKEN VALUE IN DOLLAR
            const priceData = await getCurrentTokenPrice();
            const valueInDollar =
              Number(priceData[currency]) * amountNumber;

            const senderTokenAccountId = tokenAccountId;
            const formData = {
              senderAccountId: senderTokenAccountId,
              recipientAccountId: recieverTokenAccountId,
              amount: String(amount),
              anonymous: false,
              compliant: false,
              transactionCode: req.user.email,
              paymentId: req.user.ourCustomerTatumId,
              recipientNote: req.body.memo || "no note",
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
                    //POST TRANSACTION FOR THE RECIEVER
                    //GET THE USER EMAIL FROM THE DB USING THE RECIEVER TOKEN ID
                    const recieverTrxn = {
                      userEmail: reciever.email,
                      userTaTumId: recieverTatumId,
                      transactionAmount: formatAmount(amount),
                      transactionToken: currency,
                      transactionState: "Successful",
                      transactionAmountInUsd: formatAmountInUsd(valueInDollar),
                      transactionType: "Transfer",
                      from: senderTokenAccountId,
                      transactionDetails: `Transfer ${amountNumber} at ${valueInDollar} from ${recieverTokenAccountId}`,
                      tenure: `Internal Transfer `,
                      to: "Wallet",
                      debit: false,
                      trxnRefId: referenceId,
                    };
                    new TinqfiTrxn(recieverTrxn).save();
                    //POST TRX HISTORY WITH THE USER DATA FOR THE SENDER
                    const newTinqfiTrxn = {
                      userEmail: req.user.email,
                      userTaTumId: req.user.ourCustomerTatumId,
                      transactionAmount: formatAmount(amount),
                      transactionToken: currency,
                      transactionState: "Successful",
                      transactionAmountInUsd: formatAmountInUsd(valueInDollar),
                      transactionType: "Transfer",
                      from: senderTokenAccountId,
                      transactionDetails: `Transfer ${amountNumber} at ${valueInDollar} to ${senderTokenAccountId}`,
                      tenure: `Internal Transfer `,
                      to: recieverTokenAccountId,
                      debit: true,
                      trxnRefId: referenceId,
                    };
                    new TinqfiTrxn(newTinqfiTrxn).save().then(() =>
                      res.json({
                        success: true,
                        msg: "Transfer Successful",

                      })
                    );

                  } else
                    res.status(403).send({
                      success: false,
                      msg: "Transaction Failed no response",
                    });
                })
                .catch((err) => {
                  res.status(401).send({
                    success: false,
                    msg: "Transaction Failed, insufficient balance",
                  });
                });
            } catch (e) {
              res.status(401).send({
                success: false,
                msg: "Transaction Failed",
              });
            }
            //TRANSFER FUNCTION ENDS HERE
          } else {
            res.status(401).send({
              success: false,
              msg: "Transaction Failed, Wallet address is not a TinqFi address",
            });
          }
        })
        .catch((err) => {
          // console.log(err);
          res.status(401).send({
            success: false,
            msg: "Transaction Failed, Address is not a TinqFi address",
          });
        });
    } catch (e) {
      res.status(500).send({
        success: false,
        msg: "Internal Server Error",
      });
    }
  },
};

module.exports = functions;
