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
  //GET Top 70 market data transactions
  getExternalData: function (req, res) {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=70&page=1&sparkline=false&price_change_percentage=24h%2C7d%2C30d%2C200d%2C1y`;
    try {
      const options = {
        method: "GET",
        url,
      };
      axios(options).then((ServerResponse) => {
        res.status(200).send({
          success: true,
          data: ServerResponse.data,
        });
      });
    } catch (err) {
      res.status(403).send({ success: false, msg: err });
    }
  },

  //GET Top 2 market data transactions
  getTopTwoExternalData: function (req, res) {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2Cethereum&order=market_cap_desc&per_page=2&page=1&sparkline=false&price_change_percentage=24h%2C7d%2C30d%2C200d%2C1y`;
    try {
      const options = {
        method: "GET",
        url,
      };
      axios(options).then((ServerResponse) => {
        res.status(200).send({
          success: true,
          data: ServerResponse.data,
        });
      });
    } catch (err) {
      res.status(403).send({ success: false, msg: err });
    }
  },

  //GET Coinnewsafrica news data
  getCnaLatestNews: function (req, res) {
    const url = "https://coinnewsafrica-api.herokuapp.com/api/news";
    try {
      const options = {
        method: "GET",
        url,
      };
      axios(options).then((ServerResponse) => {
        res.status(200).send({
          success: true,
          data: ServerResponse.data,
        });
      });
    } catch (err) {
      res.status(403).send({ success: false, msg: err });
    }
  },
};

module.exports = functions;
