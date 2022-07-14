const axios = require("axios");

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
  //tester
  // gettester: function (req, res) {
  //   // const searchIndexToken = customerToken.find(
  //   //   (user) => user.currency === currency
  //   // );

  //   // const priceIndexFinal = [

  //   // ]
  //   const customerToken = [
  //     {
  //       currency: "BSC",
  //       active: true,
  //       balance: {
  //         accountBalance: "0.49",
  //         availableBalance: "0.49",
  //       },
  //       accountCode: null,
  //       accountNumber: null,
  //       frozen: false,
  //       accountingCurrency: "USD",
  //       customerId: "62c4370fa7136f7f55ba1cdf",
  //       id: "62c4370f470caefdba76cba0",
  //       price: 229,
  //       dollarValue: 229 * Number(0.49),
  //     },
  //     {
  //       currency: "DOGE",
  //       active: true,
  //       balance: {
  //         accountBalance: "224.16",
  //         availableBalance: "224.16",
  //       },
  //       accountCode: null,
  //       accountNumber: null,
  //       frozen: false,
  //       accountingCurrency: "USD",
  //       customerId: "62c4370fa7136f7f55ba1cdf",
  //       id: "62c4370fa30e794c7a7b5cf1",
  //       price: 0.06,
  //       dollarValue: 0.06 * Number(224.16),
  //     },
  //     {
  //       currency: "BTC",
  //       active: true,
  //       balance: {
  //         accountBalance: "0",
  //         availableBalance: "0",
  //       },
  //       accountCode: null,
  //       accountNumber: null,
  //       frozen: false,
  //       customerId: "62c4370fa7136f7f55ba1cdf",
  //       accountingCurrency: "USD",
  //       id: "62c4370fa7136f7f55ba1cde",
  //       price: 19000,
  //       dollarValue: 19000 * Number(0),
  //     },
  //     {
  //       currency: "ETH",
  //       active: true,
  //       balance: {
  //         accountBalance: "0.1",
  //         availableBalance: "0.1",
  //       },
  //       accountCode: null,
  //       accountNumber: null,
  //       frozen: false,
  //       accountingCurrency: "USD",
  //       customerId: "62c4370fa7136f7f55ba1cdf",
  //       id: "62c4370fa8aa7e652c4f1f6a",
  //       price: 2000,
  //       dollarValue: 2000 * Number(0.1),
  //     },
  //   ];

  //   console.log(customerToken);
  // },
};

module.exports = functions;
