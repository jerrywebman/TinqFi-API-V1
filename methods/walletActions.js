const axios = require("axios");

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

        //GETTING DATA FROM COINGECKO
        const geckoUrl =
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2Cethereum%2Cdogecoin%2Cbinancecoin&page=1";
        const options = {
          method: "GET",
          url: geckoUrl,
        };
        //do something with the response object from coinGecko
        axios(options).then(async (geckoResponse) => {
          const newresponseFromGecko = [];
          const responseFromGecko = await geckoResponse.data;
          //do the heavy data processing  by slicing the data and editing it
          responseFromGecko.map(function (single) {
            if (single.name === "BNB") {
              single.name = "Binance Smart Chain";
              single.symbol = "BSC";
            } else if (single.symbol === "btc") single.symbol = "BTC";
            else if (single.symbol === "eth") single.symbol = "ETH";
            else single.symbol = "DOGE";

            var currency = single.symbol;
            var image = single.image;
            var name = single.name;
            var current_price = single.current_price;
            newresponseFromGecko.push({ name, currency, image, current_price });
          });

          //merge the arrays
          const mergeArrayByCurrency = (response, newresponseFromGecko) =>
            response.map((itm) => ({
              ...newresponseFromGecko.find(
                (item) => item.currency === itm.currency && item
              ),
              ...itm,
            }));
          let finalResponse = mergeArrayByCurrency(
            response,
            newresponseFromGecko
          );
          //send the user the token
          res.status(200).send({
            success: true,
            msg: "Token balance has been updated successfully",
            data: finalResponse,
          });
        });
      });
    } catch (err) {
      res.status(500).send({
        success: false,
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
