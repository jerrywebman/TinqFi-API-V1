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
  //GET ALL THE TOKEN ACCOUNT
  getAllTokenAccounts: function (req, res) {
    const query = new URLSearchParams({
      pageSize: "4",
      offset: "0",
    }).toString();
    const id = req.user.ourCustomerTatumId;
    const url = `${process.env.TATUM_BASE_URL}/ledger/account/customer/${id}?${query}`;
    try {
      const options = {
        method: "GET",
        headers: {
          "x-api-key": process.env.TATUM_API_KEY,
        },
        url,
      };

      axios(options).then((ServerResponse) => {
        const response = ServerResponse.data;
        //remove the xpub from the server response
        response.forEach((object) => {
          delete object["xpub"];
        });
        res.status(200).send({
          success: true,
          data: response,
        });
      });
    } catch (err) {
      res.status(500).send({
        success: true,
        msg: "Internal Server Error",
        err: err,
      });
    }
  },

  //GET A WALLET ADDRESS
  getAwalletAddress: function (req, res) {
    const id = req.params.id;
    const url = `${process.env.TATUM_BASE_URL}/offchain/account/${id}/address`;
    try {
      const options = {
        method: "GET",
        headers: {
          "x-api-key": process.env.TATUM_API_KEY,
        },
        url,
      };
      //try creating the token offchain address
      axios(options).then((ServerResponse) => {
        const response = ServerResponse.data;
        //remove the xpub from the server response
        response.forEach((object) => {
          delete object["xpub"];
        });
        res.status(200).send({
          success: true,
          data: response[0],
        });
      });
    } catch (err) {
      res.status(400).send({ success: false, msg: err });
    }
  },
};

module.exports = functions;
