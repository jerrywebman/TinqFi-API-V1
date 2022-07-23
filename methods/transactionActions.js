var Transaction = require("../models/Transaction");

var functions = {
  // GET ALL Transaction
  getAllTransaction: async function (req, res) {
    const email = req.user.email;
    try {
      const allTransaction = await Transaction.find({ userEmail: email });
      res.json({
        success: true,
        data: allTransaction,
      });
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        msg: "Failed to get any transaction",
        error: err,
      });
    }
  },

  // GET A Transaction
  getSingleTransaction: async function (req, res) {
    try {
      const singleTransaction = await Transaction.findById({
        _id: req.params.id,
      });
      res.json({
        success: true,
        data: singleTransaction,
      });
    } catch (err) {
      res.json({
        success: false,
        msg: "Failed to get any transaction",
        error: err,
      });
    }
  },

  // GET ALL Transfer Transaction
  getAllTransferTransaction: async function (req, res) {
    const email = req.user.email;
    const transactionType = "Transfer";
    try {
      const allTransaction = await Transaction.find({
        userEmail: email,
        transactionType,
      });
      res.json({
        success: true,
        data: allTransaction,
      });
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        msg: "Failed to get any Transfer transaction",
        error: err,
      });
    }
  },

  // GET ALL Investment Transaction
  getAllInvestmentTransaction: async function (req, res) {
    const email = req.user.email;
    const transactionType = "Invest";
    try {
      const allTransaction = await Transaction.find({
        userEmail: email,
        transactionType,
      });
      res.json({
        success: true,
        data: allTransaction,
      });
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        msg: "Failed to get any Investment transaction",
        error: err,
      });
    }
  },

  // GET ALL Loan Transaction
  getAllLoanTransaction: async function (req, res) {
    const email = req.user.email;
    const transactionType = "Loan";
    try {
      const allTransaction = await Transaction.find({
        userEmail: email,
        transactionType,
      });
      res.json({
        success: true,
        data: allTransaction,
      });
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        msg: "Failed to get any Loan transaction",
        error: err,
      });
    }
  },
  // GET ALL Earn Transaction
  getAllEarnTransaction: async function (req, res) {
    const email = req.user.email;
    const transactionType = "Earn";
    try {
      const allTransaction = await Transaction.find({
        userEmail: email,
        transactionType,
      });
      res.json({
        success: true,
        data: allTransaction,
      });
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        msg: "Failed to get any Earn transaction",
        error: err,
      });
    }
  },

  // GET ALL Save Transaction
  getAllSaveTransaction: async function (req, res) {
    const email = req.user.email;
    const transactionType = "Save";
    try {
      const allTransaction = await Transaction.find({
        userEmail: email,
        transactionType,
      });
      res.json({
        success: true,
        data: allTransaction,
      });
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        msg: "Failed to get any Save transaction",
        error: err,
      });
    }
  },

  // GET ALL Withdrawal Transaction
  getAllWithdrawalTransaction: async function (req, res) {
    const email = req.user.email;
    const transactionType = "Withdrawal";
    try {
      const allTransaction = await Transaction.find({
        userEmail: email,
        transactionType,
      });
      res.json({
        success: true,
        data: allTransaction,
      });
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        msg: "Failed to get any Withdrawal transaction",
        error: err,
      });
    }
  },

  // GET ALL Deposit Transaction
  getAllDepositTransaction: async function (req, res) {
    const email = req.user.email;
    const transactionType = "Deposit";
    try {
      const allTransaction = await Transaction.find({
        userEmail: email,
        transactionType,
      });
      res.json({
        success: true,
        data: allTransaction,
      });
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        msg: "Failed to get any Deposit transaction",
        error: err,
      });
    }
  },

  //DELETE a Transaction
  // deleteTransaction: async function (req, res) {
  //   try {
  //     const removedTransaction = await Transaction.remove({
  //       _id: req.params.id,
  //     });
  //     res.json({ success: true, Message: "Transaction Deleted" });
  //   } catch (err) {
  //     res.json({ message: err });
  //   }
  // },
};

module.exports = functions;
