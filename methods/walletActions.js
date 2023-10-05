const axios = require("axios");
var Loan = require("../models/Loan");
var Earn = require("../models/earn");
const getAllCurrentTokenPrice = require("../utils/getAllCurrentTokenPrice")

var functions = {
  //GET ALL THE TOKEN ACCOUNT
  getAllTokenAccounts: function (req, res) {
    try {
      const query = new URLSearchParams({
        pageSize: "10",
      }).toString();
      const id = req.user.ourCustomerTatumId;
      const url = `${process.env.TATUM_BASE_URL}/ledger/account/customer/${id}?${query}`;

      const options = {
        method: "GET",
        headers: {
          "x-api-key": process.env.TATUM_API_KEY,
        },
        url,
      };

      axios(options)
        .then(async (ServerResponse) => {
          const response = ServerResponse.data;
          //remove the xpub from the server response
          response.forEach((object) => {
            delete object["xpub"];
          });

          //GETTING DATA FROM COINGECKO
          let priceData = [];
          priceData = await getAllCurrentTokenPrice();
          console.log(priceData);
          const newresponseFromGecko = [];
          //do the heavy data processing  by slicing the data and editing it
          priceData.map(function (single) {
            if (single.name === "BNB") {
              single.name = "Smart Chain";
              single.symbol = "BSC";
            }
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
        .catch((e) => {
          res.end();
          // res.status(500).send({
          //   success: false,
          //   msg: "Error occured while updating market data",
          // });
        });

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
      // console.log(id);
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

  //GET ALL THE BALANCES
  getAllBalances: async function (req, res) {
    try {
      const query = new URLSearchParams({
        pageSize: "10",
      }).toString();
      const id = req.user.ourCustomerTatumId;
      const url = `${process.env.TATUM_BASE_URL}/ledger/account/customer/${id}?${query}`;

      const options = {
        method: "GET",
        headers: {
          "x-api-key": process.env.TATUM_API_KEY,
        },
        url,
      };

      axios(options)
        .then(async (ServerResponse) => {
          const response = ServerResponse.data;
          //remove the xpub from the server response
          response.forEach((object) => {
            delete object["xpub"];
          });

          //GETTING DATA FROM COINGECKO
          let priceData = [];
          priceData = await getAllCurrentTokenPrice();
          const newresponseFromGecko = [];
          //do the heavy data processing  by slicing the data and editing it
          priceData.map(function (single) {
            if (single.name === "BNB") {
              single.name = "Smart Chain";
              single.symbol = "BSC";
            }
            else if (single.symbol === "btc") single.symbol = "BTC";
            else if (single.symbol === "eth") single.symbol = "ETH";
            else single.symbol = "DOGE";

            var currency = single.symbol;
            var name = single.name;
            var current_price = single.current_price;
            newresponseFromGecko.push({
              name,
              currency,
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
          //GET THE TOKEN BALANCE IN USD
          let accountBalance = 0;
          finalResponse.map((single) => {
            const price = single.current_price !== undefined ? Number(single.current_price) : 1.00;
            const availableBalance = Number(
              single.balance.availableBalance
            );
            const priceInDollar = price * availableBalance;
            accountBalance = accountBalance + priceInDollar;
          });
          //------------------------------LOAN STARTS
          //GET THE LOAN BALANCE IN USD
          const loanData = await Loan.find({
            userEmail: req.user.email,
            status: true,
          });
          let loanArray = [];
          let loanPrice = 0;
          loanData.map(async (singleLoan) => {
            const getPrice = newresponseFromGecko.find(
              (single) => single.currency === singleLoan.collateralToken
            );
            loanPrice = getPrice.current_price;
            loanArray.push({
              token: singleLoan.collateralToken,
              amount: singleLoan.collateralAmountInValue,
              currentTokenPrice: loanPrice,
            });
          });
          //ADDING THE LOAN BALANCE
          let loanBalance = 0;
          // loanArray.map((single) => {
          //   loanBalance += single.amount * single.currentTokenPrice;
          // });
          //------------------------------LOAN ENDS
          //------------------------------EARN STARTS
          //GET THE EARN BALANCE IN USD
          const earnData = await Earn.find({
            userEmail: req.user.email,
            active: true,
          });

          let earnArray = [];
          let earnPrice = 0;
          earnData.map((singleEarn) => {
            const getPrice = newresponseFromGecko.find(
              (single) => single.currency === singleEarn.tokenTicker
            );
            earnPrice = getPrice.current_price;
            earnArray.push({
              token: singleEarn.tokenTicker,
              amount: singleEarn.amount,
              currentTokenPrice: earnPrice,
            });
          });
          //ADDING THE EARN BALANCE
          let earnBalance = 0;
          earnArray.map((single) => {
            earnBalance += single.amount * single.currentTokenPrice;
          });

          //------------------------------EARN ENDS
          //send the user the token
          res.status(200).send({
            success: true,
            data: {
              walletBalance: accountBalance.toFixed(2),
              portfolioBalance: (
                accountBalance +
                loanBalance +
                earnBalance
              ).toFixed(2),
              loanBalance: loanBalance.toFixed(2),
              earnBalance: earnBalance.toFixed(2),
              poolBalance: "0.00",
            },
          });
        })
        .catch((err) => {
          console.log(err);
          res.end();
          // res.status(404).send({
          //   success: false,
          //   msg: "Error occured while updating market data",
          // });
        });


    } catch (err) {
      res.status(500).send({
        success: false,
        msg: "Server unavailable",
      });
    }
  },
};

module.exports = functions;
