var Earn = require("../models/earn");
var EarnLtv = require("../models/EarnLtv");
const axios = require("axios");
var TinqfiTrxn = require("../models/Transaction");

var functions = {
  //FIND ALL FIXED PLAN LTV
  getAllEarnPackage: async function (req, res) {
    try {
      const plans = await EarnLtv.find().sort({ createdAt: -1 });
      res.json({
        sucess: true,
        msg: "Earn Plans fetched successfully",
        data: plans,
      });
    } catch (e) {
      res.status(500).send({
        success: false,
        msg: "An Internal Error occurred",
        error: e,
      });
    }
  },

  //APPLY FOR FIXED  EARN PACKAGE
  applyForFixedEarnPackage: async function (req, res) {
    try {
      //GET THE USER LEDGER ACCOUNTS AND TOKENS TO WORK WITH
      const userArray = await req.user.onRegistrationLedgerAccnts;
      const earnToken = req.body.earnToken;
      const plan = req.body.plan;

      //GET THE AMOUNT FROM THE USER
      const earnAmount = req.body.earnAmount;

      //variable type converter
      let earnTokenUppercase = earnToken.toUpperCase();
      let earnAmountNumber = Number(earnAmount);
      let uppercasePlan = plan.toUpperCase();

      //GET EARN PLAN
      const thePlan = await EarnLtv.findOne({
        tokenTicker: earnTokenUppercase,
        plan: uppercasePlan,
      });

      if (!thePlan) {
        res.status(401).send({
          success: false,
          msg: `Plan not found for ${earnTokenUppercase}`,
        });
      } else if (thePlan.minAmount > earnAmountNumber) {
        res.status(400).send({
          success: false,
          msg: "amount is below minimum amount for this plan",
        });
      } else {
        const planTenure = req.body.planTenure;
        //get the monthly profit percentage
        const monthlyProfitPercent = Number(thePlan.apy) / 12;
        //GET the daily profit percantage
        const dailyProfitPrecent = monthlyProfitPercent / 30;
        //get the daily profit
        const userDailyProfit = (dailyProfitPrecent / 100) * earnAmountNumber;
        //total profit to pay the user
        const totalProfitToPayUser = userDailyProfit * planTenure;

        //GETTING THE DATE TO END THE PLAN
        const aDayInMilliseconds = 86400000; //24 * 60 * 60 * 1000
        const today = Date.now();
        const closingDate =
          Date.now() + aDayInMilliseconds * Number(planTenure + 1);

        const searchIndex = userArray.find(
          (user) => user.tokenAccountcurrency === earnTokenUppercase
        );

        const senderDBAccountId = searchIndex.tokenAccountId;
        const formData = {
          senderAccountId: senderDBAccountId,
          recipientAccountId:
            process.env["TINQFI_EARN_ACCOUNT_" + earnTokenUppercase],
          amount: String(earnAmount),
          anonymous: false,
          compliant: false,
          transactionCode: req.user.email,
          paymentId: req.user.ourCustomerTatumId,
          recipientNote: `Earn to TinqFI on ${uppercasePlan} package`,
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
                //POST NEW EARN ORDER
                const newEarnOrder = {
                  userEmail: req.user.email,
                  amount: earnAmountNumber,
                  imageUrl: thePlan.imageUrl,
                  apy: thePlan.apy,
                  duration: planTenure,
                  dailyProfit: userDailyProfit,
                  ourCustomerTatumId: req.user.ourCustomerTatumId,
                  ourCustomerTokenId: senderDBAccountId,
                  tokenName: thePlan.tokenName,
                  tokenTicker: thePlan.tokenTicker,
                  tokenImg: thePlan.tokenImage,
                  plan: thePlan.plan,
                  totalProfit: totalProfitToPayUser,
                  closingDateTimestamp: closingDate,
                  closingDate,
                };

                new Earn(newEarnOrder).save().then(() => {
                  //POST TRX HISTORY WITH THE USER DATA IN DB
                  const newTinqfiTrxn = {
                    userEmail: req.user.email,
                    userTaTumId: req.user.ourCustomerTatumId,
                    transactionAmount: earnAmountNumber,
                    transactionToken: earnTokenUppercase,
                    transactionType: "Earn",
                    from: senderDBAccountId,
                    tenure: `${uppercasePlan} plan for ${planTenure} days `,
                    to: process.env[
                      "TINQFI_EARN_ACCOUNT_" + earnTokenUppercase
                    ],
                    debit: true,
                    trxnRefId: referenceId,
                  };
                  new TinqfiTrxn(newTinqfiTrxn).save().then(() =>
                    res.json({
                      success: true,
                      msg: "Earn Transaction Successful",
                      // trxnRefId: referenceId,
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
                msg: "Transaction Failed,sender Unauthorized",
              });
            });
        } catch (e) {
          res.status(500).send({
            success: false,
            msg: "Transaction Failed, error from axios",
          });
        }
      }
    } catch (err) {
      res
        .status(500)
        .send({ success: false, msg: "Internal Server Error Occcured" });
    }
  },

  //APPLY FOR FLEXIBLE  EARN PACKAGE
  applyForFlexibleEarnPackage: async function (req, res) {
    try {
      //GET THE USER LEDGER ACCOUNTS AND TOKENS TO WORK WITH
      const userArray = await req.user.onRegistrationLedgerAccnts;
      const earnToken = req.body.earnToken;
      const plan = req.body.plan;

      //GET THE AMOUNT FROM THE USER
      const earnAmount = req.body.earnAmount;

      //variable type converter
      let earnTokenUppercase = earnToken.toUpperCase();
      let earnAmountNumber = Number(earnAmount);
      let uppercasePlan = plan.toUpperCase();

      //GET EARN PLAN

      const thePlan = await EarnLtv.findOne({
        tokenTicker: earnTokenUppercase,
        plan: uppercasePlan,
      });

      if (!thePlan) {
        res.status(401).send({
          success: false,
          msg: `no ${uppercasePlan} Plan not found for ${earnTokenUppercase}`,
        });
      } else if (thePlan.minAmount > earnAmountNumber) {
        res.status(400).send({
          success: false,
          msg: "amount is below minimum amount for this plan",
        });
      } else {
        // const planTenure = req.body.planTenure;
        //get the monthly profit percentage
        const monthlyProfitPercent = Number(thePlan.apy) / 12;
        //GET the daily profit percantage
        const dailyProfitPrecent = monthlyProfitPercent / 30;
        //get the daily profit
        const userDailyProfit = (dailyProfitPrecent / 100) * earnAmountNumber;
        // (apy/365)/100 *
        //GETTING THE DATE TO END THE PLAN
        const aDayInMilliseconds = 86400000;
        const today = Date.now();
        const closingDate = Date.now() + aDayInMilliseconds;

        const searchIndex = userArray.find(
          (user) => user.tokenAccountcurrency === earnTokenUppercase
        );

        const senderDBAccountId = searchIndex.tokenAccountId;
        const formData = {
          senderAccountId: senderDBAccountId,
          recipientAccountId:
            process.env["TINQFI_EARN_ACCOUNT_" + earnTokenUppercase],
          amount: String(earnAmount),
          anonymous: false,
          compliant: false,
          transactionCode: req.user.email,
          paymentId: req.user.ourCustomerTatumId,
          recipientNote: `Earn to TinqFI on ${uppercasePlan} package`,
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
                //POST NEW EARN ORDER
                const newEarnOrder = {
                  userEmail: req.user.email,
                  amount: earnAmountNumber,
                  apy: thePlan.apy,
                  duration: 0,
                  imageUrl: thePlan.imageUrl,
                  dailyProfit: userDailyProfit,
                  ourCustomerTatumId: req.user.ourCustomerTatumId,
                  ourCustomerTokenId: senderDBAccountId,
                  tokenName: thePlan.tokenName,
                  tokenTicker: thePlan.tokenTicker,
                  tokenImg: thePlan.tokenImage,
                  plan: thePlan.plan,
                  closingDateTimestamp: closingDate,
                  closingDate,
                };

                new Earn(newEarnOrder).save().then(() => {
                  //POST TRX HISTORY WITH THE USER DATA IN DB
                  const newTinqfiTrxn = {
                    userEmail: req.user.email,
                    userTaTumId: req.user.ourCustomerTatumId,
                    transactionAmount: earnAmountNumber,
                    transactionToken: earnTokenUppercase,
                    transactionType: "Earn",
                    from: senderDBAccountId,
                    tenure: `${uppercasePlan} Flexible plan `,
                    to: process.env[
                      "TINQFI_EARN_ACCOUNT_" + earnTokenUppercase
                    ],
                    debit: true,
                    trxnRefId: referenceId,
                  };
                  new TinqfiTrxn(newTinqfiTrxn).save().then(() =>
                    res.json({
                      success: true,
                      msg: "Flexible Earn Transaction Successful",
                      // trxnRefId: referenceId,
                    })
                  );
                });
              } else
                res.status(403).send({
                  success: false,
                  msg: "Transaction Failed no response",
                });
            })
            .catch((err) => {
              res.status(401).send({
                success: false,
                msg: "Transaction Failed, Insufficient Balance",
              });
            });
        } catch (e) {
          res.status(500).send({
            success: false,
            msg: "Transaction Failed, error from axios",
          });
        }
      }
    } catch (err) {
      res
        .status(500)
        .send({ success: false, msg: "Internal Server Error Occcured" });
    }
  },

  getAllSubscriptions: async function (req, res) {
    try {
      const earnParams = await Earn.find({
        userEmail: req.user.email,
      }).sort({ activatedDate: -1 });
      res.json({
        success: true,
        data: earnParams,
        msg: "Subscriptions fetched",
      });
    } catch (err) {
      res
        .status(500)
        .send({ success: false, msg: "Internal Server Error Occcured" });
    }
  },

  //CLOSE A FIXED PLAN
  closeAnEarnFixedPlan: async function (req, res) {
    try {
      const orderId = req.params.orderId;
      const order = await Earn.findOne({ _id: orderId });
      // console.log(order);
      //check the dates
      const today = new Date();
      const endDate = order.closingDate;
      const todaysTimestamp = Date.parse(today);
      const valueTimestamp = Date.parse(endDate) + 86400000;

      //check if no order
      if (!order) {
        res.status(404).send({ success: false, msg: "Earn Plan not found" });
      }
      //check if its not the users order
      else if (order.userEmail !== req.user.email) {
        res.status(401).send({
          success: false,
          msg: "User not allowed to execute this function",
        });
      }

      //check if its not the users order is inactive
      else if (order.active === false) {
        res.status(401).send({
          success: false,
          msg: "Order is inactive or closed",
        });
      }
      //check if its the time has elapsed
      else if (valueTimestamp > todaysTimestamp) {
        res.status(403).send({
          success: false,
          msg: "Plan is still active",
        });
      }
      //check if order is FIXED
      else if (order.plan !== "FIXED") {
        res.status(401).send({
          success: false,
          msg: "User not allowed to execute this function",
        });
      } else {
        //get the total profit
        const totalProfit = Number(order.totalProfit);
        try {
          //get the amount, daily profit + calculate the total days
          const totalEarnAmount = order.amount + totalProfit;
          //collect the money from tinqfi and send to the user
          const formData = {
            senderAccountId:
              process.env["TINQFI_EARN_ACCOUNT_" + order.tokenTicker],
            recipientAccountId: order.ourCustomerTokenId,
            amount: String(totalEarnAmount),
            anonymous: false,
            compliant: false,
            transactionCode: req.user.email,
            paymentId: req.user.ourCustomerTatumId,
            recipientNote: `Earn to user on ${order.tokenTicker} package`,
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
                if (serverResponse.data !== null) {
                  //the response from Tatum
                  const referenceId = await serverResponse.data.reference;
                  //post a transaction to the user
                  const updatedPlan = Earn.updateOne(
                    { _id: order._id },
                    {
                      $set: {
                        active: false,
                      },
                    }
                  ).then(() => {
                    //POST TRX HISTORY WITH THE USER DATA IN DB
                    const newTinqfiTrxn = {
                      userEmail: req.user.email,
                      userTaTumId: req.user.ourCustomerTatumId,
                      transactionAmount: totalEarnAmount,
                      transactionToken: order.tokenTicker,
                      transactionType: "Earn",
                      from: process.env[
                        "TINQFI_EARN_ACCOUNT_" + order.tokenTicker
                      ],
                      tenure: `Somedays on ${order.tokenTicker} Flexible plan`,
                      to: order.ourCustomerTokenId,
                      debit: false,
                      trxnRefId: referenceId,
                    };
                    new TinqfiTrxn(newTinqfiTrxn).save().then(() =>
                      res.json({
                        success: true,
                        msg: "Earn Transaction Successful",
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
                res.status(403).send({
                  success: false,
                  msg: "Transaction Failed,sender Unauthorized",
                });
              });
          } catch (e) {
            res.status(500).send({
              success: false,
              msg: "Transaction Failed, error from axios",
            });
          }
        } catch (err) {
          res.json({
            success: false,
            msg: "An error occurred while trying to close the plan",
          });
        }
      }
    } catch (e) {
      res
        .status(500)
        .send({ success: false, msg: "Internal Server Error Occcured" });
    }
  },

  //CLOSE AN EARN FLEXIBLE PLAN
  closeAnEarnFlexiblePlan: async function (req, res) {
    try {
      const orderId = req.params.orderId;
      const order = await Earn.findOne({ _id: orderId });

      //convert to timestamp
      const createdAtInTimestamp = Date.parse(order.activatedDate);
      const today = new Date();
      const todaysDateTimestamp = Date.parse(today);
      const dateDifference = todaysDateTimestamp - createdAtInTimestamp;

      //check if no order
      if (!order) {
        res.status(404).send({ success: false, msg: "order not found" });
      }
      //check if order is inactive
      else if (order.active === false) {
        res.status(401).send({
          success: false,
          msg: "Order is inactive or closed",
        });
      }
      //check if its not the user order
      else if (order.userEmail != req.user.email) {
        res.status(401).send({
          success: false,
          msg: "User not allowed to execute this function",
        });
      }
      //check if its not up to 24 hrs
      else if (dateDifference < 86400000) {
        res.status(401).send({
          success: false,
          msg: "Plan can only be cancelled after 24hrs of activation",
        });
      }
      //check if order is FIXED
      else if (order.plan === "FIXED") {
        res.status(404).send({
          success: false,
          msg: "User not allowed to execute this function",
        });
      } else {
        //todays date
        const today = Date.now();

        //the difference between created date and todays date
        const dateDiff = today - createdAtInTimestamp;
        //convert to days 86400000 = one day in timestamp and do not round up
        const daysToEarnProfit = (dateDiff / 86400000) | 0;
        //get the total profit
        const totalProfit = Number(order.dailyProfit) * daysToEarnProfit;
        try {
          //get the amount, daily profit + calculate the total days
          const totalEarnAmount = order.amount + totalProfit;
          //collect the money from tinqfi and send to the user
          const formData = {
            senderAccountId:
              process.env["TINQFI_EARN_ACCOUNT_" + order.tokenTicker],
            recipientAccountId: order.ourCustomerTokenId,
            amount: String(totalEarnAmount),
            anonymous: false,
            compliant: false,
            transactionCode: req.user.email,
            paymentId: req.user.ourCustomerTatumId,
            recipientNote: `Earn to user on ${order.tokenTicker} package`,
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
                if (serverResponse.data !== null) {
                  //the response from Tatum
                  const referenceId = await serverResponse.data.reference;

                  //post a transaction to the user
                  const updatedPlan = Earn.updateOne(
                    { _id: order._id },
                    {
                      $set: {
                        active: false,
                        closingDate: Date.now(),
                      },
                    }
                  ).then(() => {
                    //POST TRX HISTORY WITH THE USER DATA IN DB
                    const newTinqfiTrxn = {
                      userEmail: req.user.email,
                      userTaTumId: req.user.ourCustomerTatumId,
                      transactionAmount: totalEarnAmount,
                      transactionToken: order.tokenTicker,
                      transactionType: "Earn",
                      from: process.env[
                        "TINQFI_EARN_ACCOUNT_" + order.tokenTicker
                      ],
                      tenure: `${daysToEarnProfit} days on ${order.tokenTicker} Flexible plan`,
                      to: order.ourCustomerTokenId,
                      debit: false,
                      trxnRefId: referenceId,
                    };
                    new TinqfiTrxn(newTinqfiTrxn).save().then(() =>
                      res.json({
                        success: true,
                        msg: "Earn Transaction Successful",
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
                res.status(403).send({
                  success: false,
                  msg: "Transaction Failed,sender Unauthorized",
                });
              });
          } catch (e) {
            res.status(500).send({
              success: false,
              msg: "Transaction Failed, error from axios",
            });
          }
        } catch (err) {
          res.json({
            success: false,
            msg: "An error occurred while trying to close the plan",
          });
        }
      }
    } catch (e) {
      res
        .status(500)
        .send({ success: false, msg: "Internal Server Error Occcured" });
    }
  },
};

module.exports = functions;
