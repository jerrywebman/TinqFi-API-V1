var Money = require("../../models/money");
var Transaction = require("../../models/Transaction");

var functions = {
  //update naira balance credit
  addToUserEmergeBalance: async function (req, res) {
    // const secretPass = req.body.secret;
    if (
      req.body.email &&
      req.body.emergeAmount
      // secretPass === process.env.SECRET_PASS &&
      // req.user.email === "dennismarye@gmail.com"
    ) {
      const value = Number(req.body.emergeAmount);
      const updatedUserMoney = await Money.findOneAndUpdate(
        { userEmail: req.body.email },
        {
          $inc: {
            emergeBalance: +value,
          },
        }
      );
      res.json({
        success: true,
        Message: "Emerge Balance Successfully updated",
      });
      //create trxn data
      // var newTransaction = Transaction({
      //   userEmail: req.body.email,
      //   transactionAmount: value,
      //   transactionType: "Deposit",
      // });
      // newTransaction.save(function () {});
    } else {
      res.json({
        success: false,
        Message:
          "Error, Please make sure all parameters are well sent to the server",
      });
    }
  },

  //** UPDATE ORIGIN BALANCE */
  addToUserOriginBalance: async function (req, res) {
    if (req.body.email && req.body.originAmount) {
      const defaultEmail = req.body.email;
      const value = Number(req.body.originAmount);
      const lowerCaseEmail = defaultEmail.toLowerCase();
      const updatedUserMoney = await Money.findOneAndUpdate(
        { _id: lowerCaseEmail },
        {
          $inc: {
            originBalance: +value,
          },
        }
      );
      res.json({
        success: true,
        Message: "Origin Balance Successfully updated",
      });
    } else {
      res.json({
        success: false,
        Message:
          "Error, Please make sure all parameters are well sent to the server",
      });
    }
  },

  //update naira balance debit
  minusFromUserBalance: async function (req, res) {
    const secretPass = req.body.secret;
    if (
      req.body.email &&
      req.body.amount &&
      secretPass === process.env.SECRET_PASS &&
      req.user.email === "dennismarye@gmail.com"
    ) {
      const value = Number(req.body.amount);
      const updatedUserMoney = await Money.findOneAndUpdate(
        { userEmail: req.body.email },
        {
          $inc: {
            investmentBalance: -value,
          },
        }
      );
      res.json({
        success: true,
        Message: "User Balance Successfully updated",
      });
      //create trxn data
      var newTransaction = Transaction({
        userEmail: req.body.email,
        transactionAmount: value,
        transactionType: "Withdrawal",
      });
      newTransaction.save(function () {});
    } else {
      res.json({
        success: false,
        Message: "Invalid Route",
      });
    }
  },

  getAUserBalance: async function (req, res) {
    try {
      // const secretPass = req.body.secret;
      // const secretEnv = process.env.SECRET_PASS;

      // if (
      //   req.body.email &&
      //   secretPass === secretEnv &&
      //   req.user.email === "dennismarye@gmail.com"
      // ) {
      const singleUserBalance = await Money.findOne({
        userEmail: req.body.email,
      });
      res.json(singleUserBalance);
    } catch (err) {
      res.json({ message: err });
    }
  },

  //** GET A USER BALANCE WHEN USER IS LOGGED IN */
  getUserBalance: async function (req, res) {
    try {
      const singleUserBalance = await Money.findOne({
        userEmail: req.user.email,
      });
      res.json(singleUserBalance);
    } catch (err) {
      res.json({ message: err });
    }
  },

  //** GET A USER BALANCE WHEN USER IS LOGGED IN AND FINDING THE PERCENTAGES */
  getUserBalanceCalculated: async function (req, res) {
    try {
      const singleUserBalance = await Money.findOne({
        userEmail: req.user.email,
      });
      // res.json(singleUserBalance);

      if (singleUserBalance) {
        async function calculatedBalance() {
          const emerge = await Number(singleUserBalance.emergeBalance);
          const origin = await Number(singleUserBalance.originBalance);
          const portfolioTotal = await (emerge + origin);
          const emergePercentage = (await (emerge / portfolioTotal)) * 100;
          const originPercentage = (await (origin / portfolioTotal)) * 100;
          const serverResponse = {
            emergePercentage,
            originPercentage,
            portfolioTotal,
          };
          res.json(serverResponse);
        }
        calculatedBalance();
      } else {
        res.status(400).send({ success: false, message: err });
      }
    } catch (err) {
      res.json({ message: err });
    }
  },
};

module.exports = functions;
