var Transaction = require("../models/Transaction");

var functions = {
  //get all user transactions
  getAllUserTransaction: async function (req, res) {
    try {
      const singleUserTransactions = await Transaction.find({
        userEmail: req.user.email,
      });
      res.json(singleUserTransactions);
    } catch (err) {
      res.json({ message: err });
    }
  },
  //get all user deposit transactions
  getAllUserDepositTransaction: async function (req, res) {
    try {
      const singleUserTransactions = await Transaction.find({
        userEmail: req.user.email,
        transactionType: "Deposit",
      });
      res.json(singleUserTransactions);
    } catch (err) {
      res.json({ message: err });
    }
  },
  //get all user Withdrawal transactions
  getAllUserWithdrawalTransaction: async function (req, res) {
    try {
      const singleUserTransactions = await Transaction.find({
        userEmail: req.user.email,
        transactionType: "Withdrawal",
      });
      res.json(singleUserTransactions);
    } catch (err) {
      res.json({ message: err });
    }
  },

  //get all Withdrawal transactions
  getAllWithdrawalTransaction: async function (req, res) {
    try {
      const userTransactions = await Transaction.find({
        transactionType: "Withdrawal",
      });
      res.json(userTransactions);
    } catch (err) {
      res.json({ message: err });
    }
  },
  //get all Deposit transactions
  getAllDepositTransaction: async function (req, res) {
    try {
      const userTransactions = await Transaction.find({
        transactionType: "Deposit",
      });
      res.json(userTransactions);
    } catch (err) {
      res.json({ message: err });
    }
  },
};

module.exports = functions;
