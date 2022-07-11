var User = require("../models/user");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const { createClient } = require("redis");
const createWalletActions = require("./specialMethods/createWalletActions");
const emailTemplate = require("../middleware/emailTemplate");
var AddressStore = require("../models/address");
const axios = require("axios");

//for redis
// const client = createClient({
//   url: process.env.REDIS_URL,
//   socket: {
//     tsl: true,
//     rejectUnauthorized: false,
//   },
// });
const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));

client.connect();

var functions = {
  //GET A Incoming transactions

  makeInternalTransfer: function (req, res) {
    res.send({ success: true, msg: "Internal transfer route" });
  },

  //INVEST IN TINQFI
  investInTinqFi: function (req, res) {
    const formData = {
      // senderAccountId: req.user.onRegistrationLedgerAccnts[2].tokenAccountId,
      senderAccountId: "62c4370f470caefdba76cba0",
      recipientAccountId: "62cc2d58f185e6ef82d34792",
      amount: "0.01",
      anonymous: false,
      compliant: false,
      transactionCode: req.user.email,
      paymentId: "req.user.ourCustomerTatumId",
      recipientNote: "req.body.recipientNote",
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
            console.log(serverResponse.data);
          } else console.log(serverResponse);
        })

        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
  },

  //TRANSFER TO A BLOCKCHAIN
  transferToBlockchain: function (req, res) {
    const formData = {
      senderAccountId: "62c4370f470caefdba76cba0",
      recipientAccountId: "62cc2d58f185e6ef82d34792",
      amount: "0.01",
      anonymous: false,
      compliant: false,
      transactionCode: req.user.email,
      paymentId: "req.user.ourCustomerTatumId",
      recipientNote: "req.body.recipientNote",
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
        .then((serverResponse) => {
          if (serverResponse.data !== null) {
            //the response from Tatum
            console.log(serverResponse.data);
          } else console.log(serverResponse);
        })

        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
  },
};

module.exports = functions;
