const axios = require("axios");

var functions = {
  //GET Top 70 market data transactions
  getExternalData: function (req, res) {
    try {
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=70&page=1&sparkline=false&price_change_percentage=24h%2C7d%2C30d%2C200d%2C1y`;

      const options = {
        method: "GET",
        url,
      };
      axios(options)
        .then((ServerResponse) => {
          res.status(200).send({
            success: true,
            data: ServerResponse.data,
          });
        })
        .catch(() =>
          res
            .status(403)
            .send({ success: false, msg: "error fetching market data" })
        );
    } catch (err) {
      res.status(403).send({
        success: false,
        msg: "Server error occured fetching market data",
      });
    }
  },

  //GET Top 2 market data transactions
  getTopTwoExternalData: function (req, res) {
    try {
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2Cethereum&order=market_cap_desc&per_page=2&page=1&sparkline=false&price_change_percentage=24h%2C7d%2C30d%2C200d%2C1y`;

      const options = {
        method: "GET",
        url,
      };
      axios(options)
        .then((ServerResponse) => {
          res.status(200).send({
            success: true,
            data: ServerResponse.data,
          });
        })
        .catch(() =>
          res
            .status(403)
            .send({ success: false, msg: "error fetching market data" })
        );
    } catch (err) {
      res.status(403).send({ success: false, msg: err });
    }
  },

  //GET Coinnewsafrica news data
  getCnaLatestNews: function (req, res) {
    try {
      const url = "https://coinnewsafrica.cyclic.app/api/news";

      const options = {
        method: "GET",
        url,
      };
      axios(options)
        .then((ServerResponse) => {
          res.status(200).send({
            success: true,
            data: ServerResponse.data,
          });
        })
        .catch(() =>
          res
            .status(403)
            .send({ success: false, msg: "error fetching news data ." })
        );
    } catch (err) {
      res.status(403).send({ success: false, msg: "Server error occured" });
    }
  },
};

module.exports = functions;
