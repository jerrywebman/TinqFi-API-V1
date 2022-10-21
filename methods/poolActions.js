var Pool = require("../models/Pool");
const axios = require("axios");
var TinqfiTrxn = require("../models/Transaction");

var functions = {
  //ADD A POOL DATA
  addPool: function (req, res) {
    try {
      //CALCULATING THE END DATE
      const closingDate = Date.now() + 86400000 * Number(req.body.poolDuration);
      //convert to date format
      var endDate = new Date(closingDate * 1000);
      const newPoolParams = {
        poolName: req.body.poolName,
        poolImageUrl: req.body.poolImageUrl,
        poolStatus: req.body.poolStatus,
        poolTrustee: req.body.poolTrustee,
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
        endDate,
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
  explorePool: async function (req, res) {
    try {
      const poolParams = await Pool.find({ poolStatus: "Active" }).sort({
        createdAt: -1,
      });
      if (poolParams.length < 1) {
        res.json({
          success: true,
          msg: "No Pool Data available",
        });
      } else {
        res.json({
          success: true,
          msg: "Pool Data available ",
          data: poolParams,
        });
      }
    } catch (e) {
      res.status(500).send({
        success: false,
        msg: "Internal Server Error",
      });
    }
  },
  //GET ALL AVAILABLE POOL DATA
  getAllUserPool: async function (req, res) {
    try {
      const poolParams = await Pool.find({
        "participants.userEmail": req.user.email,
      }).sort({ createdAt: -1 });
      if (poolParams.length < 1) {
        const poolInactiveParams = await Pool.find({
          poolStatus: "Completed",
        }).sort({ createdAt: -1 });
        let newPoolData = [];
        poolInactiveParams.forEach((single) => {
          newPoolData.push({
            _id: single._id,
            poolName: single.poolName,
            poolStatus: single.poolStatus,
            poolTrustee: single.poolTrustee,
            poolImageUrl: single.poolImageUrl,
            poolIntro: single.poolIntro,
            poolTarget: single.poolTarget,
            poolCurrency: single.poolCurrency,
            createdAt: single.createdAt,
            endDate: single.endDate,
            participants: single.participants.length,
            stakedTokenValueInUsd: 0,
            poolProfit: single.poolProfit,
            stakedTokenValue: 0,
            totalPoolReward: Number(
              (single.poolProfit / 100) * single.totalStakedToken
            ).toFixed(8),
            totalStakedToken: single.totalStakedToken,
            totalCommitment: single.totalCommitment,
          });
        });
        res.json({
          success: true,
          msg: "Inactive Pool Data available ",
          data: newPoolData,
        });
      } else {
        let newPoolData = [];
        poolParams.forEach((single) => {
          //GET THE VALUE OF TOKEN USED
          let stakedTokenValue = 0;
          let stakedTokenValueInUsd = 0;

          //GET THE TOTAL STAKED AND COMMITMENT OF TOKEN USED
          const total = single;
          const theUser = single.participants.filter(
            (user) => user.userEmail === req.user.email
          );

          theUser.map((single) => {
            stakedTokenValue += single.amount;
            stakedTokenValueInUsd += single.priceInUsd;
          });
          newPoolData.push({
            _id: single._id,
            poolName: single.poolName,
            poolStatus: single.poolStatus,
            poolTrustee: single.poolTrustee,
            poolImageUrl: single.poolImageUrl,
            poolIntro: single.poolIntro,
            poolTarget: single.poolTarget,
            poolCurrency: single.poolCurrency,
            createdAt: single.createdAt,
            endDate: single.endDate,
            participants: single.participants.length,
            stakedTokenValueInUsd: stakedTokenValueInUsd.toFixed(2),
            poolProfit: single.poolProfit,
            stakedTokenValue: stakedTokenValue.toFixed(8),
            totalPoolReward: Number(
              (single.poolProfit / 100) * stakedTokenValue
            ).toFixed(8),
            totalStakedToken: single.totalStakedToken,
            totalCommitment: single.totalCommitment,
          });
        });
        res.json({
          success: true,
          msg: "Pool Data available ",
          data: newPoolData,
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).send({
        success: false,
        msg: "Internal Server Error",
      });
    }
  },

  //APPLY FOR A POOL
  subscribeToPool: async function (req, res) {
    try {
      const poolParams = await Pool.findOne({
        _id: req.params.id,
        poolStatus: "Active",
      });
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
                    const addParticipant = await Pool.updateOne(
                      { _id: req.params.id },
                      {
                        $inc: {
                          totalStakedToken: amountInNumber,
                          totalCommitment: Number(tokenPriceInUsd),
                        },
                      },
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
