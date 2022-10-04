const axios = require("axios");

var functions = {
  //GET ALL THE TOKEN ACCOUNT
  getAllTokenAccounts: function (req, res) {
    try {
      const query = new URLSearchParams({
        pageSize: "10",
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

        axios(options)
          .then((ServerResponse) => {
            const response = ServerResponse.data;
            console.log(response);
            //remove the xpub from the server response
            response.forEach((object) => {
              delete object["xpub"];
            });

            //GETTING DATA FROM COINGECKO
            const geckoUrl =
              "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2Cethereum%2Cdogecoin%2Cbinancecoin%2Cbinance-usd&page=1";
            const options = {
              method: "GET",
              url: geckoUrl,
            };
            //do something with the response object from coinGecko
            axios(options)
              .then(async (geckoResponse) => {
                const newresponseFromGecko = [];
                const responseFromGecko = await geckoResponse.data;
                console.log(responseFromGecko);
                //do the heavy data processing  by slicing the data and editing it
                responseFromGecko.map(function (single) {
                  if (single.name === "BNB") {
                    single.name = "Smart Chain";
                    single.symbol = "BSC";
                  } else if (single.symbol === "busd")
                    single.symbol = "MY_BUSD";
                  else if (single.symbol === "btc") single.symbol = "BTC";
                  else if (single.symbol === "eth") single.symbol = "ETH";
                  else single.symbol = "DOGE";

                  var currency = single.symbol;
                  var image = single.image;
                  var name = single.name;
                  var current_price = single.current_price;
                  newresponseFromGecko.push({
                    name,
                    currency,
                    image,
                    current_price,
                  });
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
                  msg: "Token balance has been updated successfully.",
                  data: finalResponse,
                });
              })
              .catch(() => {
                res.status(500).send({
                  success: false,
                  msg: "Error occured while updating market data",
                });
              });
          })
          .catch((e) => {
            res.status(403).send({
              success: false,
              msg: "error from market data server",
            });
          });
      } catch (err) {
        res.status(500).send({
          success: false,
          msg: "Internal Server Error",
        });
      }
    } catch (err) {
      res.status(503).send({
        success: false,
        msg: "Server unavailable",
      });
    }
  },

  //GET A WALLET ADDRESS
  getAwalletAddress: function (req, res) {
    try {
      const id = req.params.id;
      const url = `${process.env.TATUM_BASE_URL}/offchain/account/${id}/address`;
      console.log(id);
      try {
        const options = {
          method: "GET",
          headers: {
            "x-api-key": process.env.TATUM_API_KEY,
          },
          url,
        };
        //try creating the token offchain address
        axios(options)
          .then((ServerResponse) => {
            const response = ServerResponse.data;
            //remove the xpub from the server response
            response.forEach((object) => {
              delete object["xpub"];
            });
            res.status(200).send({
              success: true,
              msg: "Address found",
              data: response[0],
            });
          })
          .catch(() =>
            res
              .status(403)
              .send({ success: false, msg: "error from server ax" })
          );
      } catch (err) {
        res.status(400).send({ success: false, msg: err });
      }
    } catch (err) {
      res.status(503).send({
        success: false,
        msg: "Server unavailable",
        err: err,
      });
    }
  },
};

module.exports = functions;
