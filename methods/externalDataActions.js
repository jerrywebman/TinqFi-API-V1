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
  gettester: function (req, res) {
    const customerToken = [
      {
        id: "binancecoin",
        symbol: "bnb",
        name: "BNB",
        image:
          "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850",
        current_price: 236.72,
        market_cap: 38605151056,
        market_cap_rank: 5,
        fully_diluted_valuation: 39040149269,
        total_volume: 1341055088,
        high_24h: 239.58,
        low_24h: 234.93,
        price_change_24h: 0.881543,
        price_change_percentage_24h: 0.3738,
        market_cap_change_24h: 103843849,
        market_cap_change_percentage_24h: 0.26972,
        circulating_supply: 163276974.63,
        total_supply: 163276974.63,
        max_supply: 165116760.0,
        ath: 686.31,
        ath_change_percentage: -65.41284,
        ath_date: "2021-05-10T07:24:17.097Z",
        atl: 0.0398177,
        atl_change_percentage: 596051.88445,
        atl_date: "2017-10-19T00:00:00.000Z",
        roi: null,
        last_updated: "2022-07-15T16:36:50.154Z",
      },
      {
        id: "dogecoin",
        symbol: "doge",
        name: "Dogecoin",
        image:
          "https://assets.coingecko.com/coins/images/5/large/dogecoin.png?1547792256",
        current_price: 0.062451,
        market_cap: 8280344960,
        market_cap_rank: 10,
        fully_diluted_valuation: null,
        total_volume: 353125467,
        high_24h: 0.064186,
        low_24h: 0.060962,
        price_change_24h: 0.00130307,
        price_change_percentage_24h: 2.13101,
        market_cap_change_24h: 163173899,
        market_cap_change_percentage_24h: 2.01023,
        circulating_supply: 132670764299.894,
        total_supply: null,
        max_supply: null,
        ath: 0.731578,
        ath_change_percentage: -91.41928,
        ath_date: "2021-05-08T05:08:23.458Z",
        atl: 8.69e-5,
        atl_change_percentage: 72134.71667,
        atl_date: "2015-05-06T00:00:00.000Z",
        roi: null,
        last_updated: "2022-07-15T16:36:08.888Z",
      },
    ];

    const customerAccount = [
      {
        currency: "BSC",
        active: true,
        balance: {
          accountBalance: "0.49",
          availableBalance: "0.49",
        },
        accountCode: null,
        accountNumber: null,
        frozen: false,
        accountingCurrency: "USD",
        customerId: "62c4370fa7136f7f55ba1cdf",
        id: "62c4370f470caefdba76cba0",
      },
      {
        currency: "DOGE",
        active: true,
        balance: {
          accountBalance: "224.16",
          availableBalance: "224.16",
        },
        accountCode: null,
        accountNumber: null,
        frozen: false,
        accountingCurrency: "USD",
        customerId: "62c4370fa7136f7f55ba1cdf",
        id: "62c4370fa30e794c7a7b5cf1",
      },
      {
        currency: "BTC",
        active: true,
        balance: {
          accountBalance: "0",
          availableBalance: "0",
        },
        accountCode: null,
        accountNumber: null,
        frozen: false,
        customerId: "62c4370fa7136f7f55ba1cdf",
        accountingCurrency: "USD",
        id: "62c4370fa7136f7f55ba1cde",
      },
      {
        currency: "ETH",
        active: true,
        balance: {
          accountBalance: "0.1",
          availableBalance: "0.1",
        },
        accountCode: null,
        accountNumber: null,
        frozen: false,
        accountingCurrency: "USD",
        customerId: "62c4370fa7136f7f55ba1cdf",
        id: "62c4370fa8aa7e652c4f1f6a",
      },
    ];

    // Log to console
    console.log("coingecko data", customerToken);

    const newArray = [];
    customerToken.map(function (single) {
      var currency = single.symbol;
      var name = single.name;
      var image = single.image;
      var current_price = single.current_price;
      newArray.push({ currency, image, current_price });
    });

    let arr3 = newArray.map((item, i) =>
      Object.assign({}, item, customerAccount[i])
    );

    console.log("Extracted data", newArray);
    console.log("Tatum", customerAccount);
    console.log("Merged Array", arr3);
  },
};

module.exports = functions;
