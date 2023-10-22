const axios = require("axios");
const tatumcalls = require("../../config/tatumcalls");

var functions = {
  //CREATE ALL INITIALIZATION WALLETS
  //BTC,ETH,BSC,DOGE,SOL,CELO,TRX,USDT,POLY,LTC
  initWallets: async function (clientEmail) {
    try {
      const externalId = clientEmail;
      const tokens = ["BTC", "ETH", "BSC", "DOGE"];
      // const tokens = ["BTC", "ETH", "BSC", "DOGE", "SOL", "CELO", "TRX", "LTC", "MATIC"];
      tokens.map(async (token, index) => {
        const xpub = process.env[token + "_XPUB"];
        await tatumcalls.createLedgerAccount(token, xpub, externalId);
      })
    } catch (e) {
      console.log(e);
    }
  },
  //CREATE WALLETS
  createWallet: async function (req, res) {
    //step 1
    try {
      //if successful create btc ledger account
      const currency = req.params.currency;
      const xpub = process.env[currency + "_XPUB"];
      const externalId = req.user.email;
      //check the currency to know the blockchain
      if (currency === "TRX") {
        const wallet = process.env.TRX_WALLET_FOR_ACCOUNT_CREATION;
        if (wallet === undefined || externalId === undefined || currency === undefined)
          return res.status(500).json({
            success: false,
            message: 'Service unavailable, Please try again'
          })
        const response = await tatumcalls.createLedgerAccountWithoutXpub(currency, wallet, externalId);
        res.json({
          success: response.success,
          message: response.message
        })
      } else {
        //do this for any account that requires xpub
        if (xpub === undefined || externalId === undefined || currency === undefined)
          return res.status(500).json({
            success: false,
            message: 'Service unavailable, Please try again'
          })
        const response = await tatumcalls.createLedgerAccount(currency, xpub, externalId);
        res.json({
          success: response.success,
          message: response.message
        })
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: 'Service unavailable, Please try again'
      })
    }
  },
  //BITCOIN XPUB
  createBtcWallet: async function (clientEmail) {
    //step 1
    try {
      //if successful create btc ledger account
      const currency = "BTC";
      const xpub = process.env.BTC_XPUB;
      const externalId = clientEmail;
      tatumcalls
        .createLedgerAccount(currency, xpub, externalId)
        .then()
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
  },

  //ETHEREUM WALLET XPUB
  createETHWallet: async function (clientEmail) {
    //step 1
    try {
      //if successful create ETH ledger account
      const currency = "ETH";
      const xpub = process.env.ETH_XPUB;
      const externalId = clientEmail;
      tatumcalls
        .createLedgerAccount(currency, xpub, externalId)
        .then()
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
  },

  //BINANCE SMART CHAIN XPUB
  createBSCWallet: async function (clientEmail) {
    //step 1
    try {
      //if successful create BSC ledger account
      const currency = "BSC";
      const xpub = process.env.BSC_XPUB;
      const externalId = clientEmail;
      tatumcalls
        .createLedgerAccount(currency, xpub, externalId)
        .then()
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
  },

  //DOGE CHAIN XPUB
  // createBNBWallet: async function (clientEmail) {
  //   //step 1
  //   const url = `${process.env.TATUM_BASE_URL}/bnb/account`;
  //   try {
  //     const options = {
  //       method: "GET",
  //       headers: {
  //         "x-api-key": process.env.TATUM_API_KEY,
  //       },
  //       url,
  //     };
  //     //step 2
  //     //try creating the BNB account
  //     await axios(options)
  //       .then(async (serverResponse) => {
  //         if (serverResponse.data !== null) {
  //           console.log(serverResponse.data);
  //           //if successful create BNB ledger account
  //           const currency = "BNB";
  //           const xpub = serverResponse.data.xpub;
  //           const externalId = clientEmail;
  //           tatumcalls
  //             .createLedgerAccount(currency, xpub, externalId)
  //             .then()
  //             .catch((err) => {
  //               console.log(err);
  //             });
  //         } else console.log(serverResponse);
  //       })

  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // },

  //DOGE WALLET XPUB
  createDOGEWallet: async function (clientEmail) {
    //step 1
    try {
      //if successful create ETH ledger account
      const currency = "DOGE";
      const xpub = process.env.DOGE_XPUB;
      const externalId = clientEmail;
      tatumcalls
        .createLedgerAccount(currency, xpub, externalId)
        .then()
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
  },
};

module.exports = functions;
