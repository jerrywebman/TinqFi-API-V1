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
        poolMinAmountInUsd: req.body.poolMinAmountInUsd,
        poolMaxAmountInUsd: req.body.poolMaxAmountInUsd,
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
      const poolParams = await Pool.findOne({ _id: req.params.id });
      const userArray = await req.user.onRegistrationLedgerAccnts;
      const token = poolParams.poolCurrency;
      const amount = req.body.amount;
      const amountInNumber = Number(amount);

      //SEARCH TO GET THE USER TOKEN ACCOUNT
      const searchIndex = await userArray.find(
        (user) => user.tokenAccountcurrency == token
      );
      const senderTokenAccountId = searchIndex.tokenAccountId;

      //GET THE CURRENT PRICE OF THE TOKENS
      const options = {
        method: "GET",
        url: process.env.PRICE_API,
      };
      //do something with the response object from coinGecko
      axios(options)
        .then(async (geckoResponse) => {
          const responseFromGecko = await geckoResponse.data;
          const busd = "binance-usd";
          //rearrange the response object
          const priceData = {
            BTC: responseFromGecko.bitcoin.usd,
            ETH: responseFromGecko.ethereum.usd,
            BSC: responseFromGecko.binancecoin.usd,
            DOGE: responseFromGecko.dogecoin.usd,
            BUSD: responseFromGecko[busd].usd,
          };
          //GET THE TOKEN PRICE IN USD
          const tokenPriceInUsd = amountInNumber * priceData[token];
          console.log(tokenPriceInUsd);
          //CHECK FOR THE MIN AND MAX AMOUNT
          if (
            tokenPriceInUsd < poolParams.poolMinAmountInUsd ||
            tokenPriceInUsd > poolParams.poolMaxAmountInUsd
          ) {
            res.status(401).send({
              success: false,
              msg: `Minimum amount $${poolParams.poolMinAmountInUsd} is and maximum amount is $${poolParams.poolMaxAmountInUsd}  `,
            });
          } else {
            const formData = {
              senderAccountId: senderTokenAccountId,
              recipientAccountId: process.env["TINQFI_POOL_ACCOUNT_" + token],
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
                            amount: amountInNumber,
                            refId: referenceId,
                            priceInUsd: tokenPriceInUsd,
                            token,
                            tokenAccountId: senderTokenAccountId,
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
                        transactionToken: token,
                        transactionType: "Pool",
                        from: senderTokenAccountId,
                        tenure: `${poolParams.poolName} pool `,
                        to: "Tinqfi Pool Account",
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
          }
        })
        .catch((err) => {
          res.status(500).send({
            success: false,
            msg: "Internal Server Error",
          });
        });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        success: false,
        msg: "Internal Server Error",
      });
    }
  },

  trying: async function (req, res) {
    //GET THE CURRENT PRICE OF THE TOKENS
    const options = {
      method: "GET",
      url: process.env.PRICE_API,
    };
    //do something with the response object from coinGecko
    axios(options)
      .then(async (geckoResponse) => {
        if (geckoResponse) {
          const responseFromGecko = await geckoResponse.data;
          const busd = "binance-usd";
          //rearrange the response object
          const priceData = {
            BTC: responseFromGecko.bitcoin.usd,
            ETH: responseFromGecko.ethereum.usd,
            BSC: responseFromGecko.binancecoin.usd,
            DOGE: responseFromGecko.dogecoin.usd,
            BUSD: responseFromGecko[busd].usd,
          };
          res.send(priceData);
        }
      })
      .catch((err) => {
        console.log(err);
        const priceData = {
          BTC: 1,
          ETH: 1,
          BSC: 1,
          DOGE: 1,
          BUSD: 1,
        };
        res.send(priceData);
      });
  },
};

module.exports = functions;
