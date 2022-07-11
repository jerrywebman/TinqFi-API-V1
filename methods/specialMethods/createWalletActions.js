const axios = require("axios");
const tatumcalls = require("../../config/tatumcalls");

var functions = {
  //BITCOIN XPUB
  createBtcWallet: async function (clientEmail) {
    //step 1
    const url = `${process.env.TATUM_BASE_URL}/bitcoin/wallet`;
    try {
      const options = {
        method: "GET",
        headers: {
          "x-api-key": process.env.TATUM_API_KEY,
        },
        url,
      };
      //step 2
      //try creating the btc account
      await axios(options)
        .then(async (serverResponse) => {
          if (serverResponse.data !== null) {
            console.log(serverResponse.data);
            //if successful create btc ledger account
            const currency = "BTC";
            const xpub = serverResponse.data.xpub;
            const externalId = clientEmail;
            tatumcalls
              .createLedgerAccount(currency, xpub, externalId)
              .then()
              .catch((err) => {
                console.log(err);
              });
          } else console.log(serverResponse);
        })

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
    const url = `${process.env.TATUM_BASE_URL}/ethereum/wallet`;
    try {
      const options = {
        method: "GET",
        headers: {
          "x-testnet-type": "ethereum-ropsten",
          "x-api-key": process.env.TATUM_API_KEY,
        },
        url,
      };
      //step 2
      //try creating the ETH account
      await axios(options)
        .then(async (serverResponse) => {
          if (serverResponse.data !== null) {
            console.log(serverResponse.data);
            //if successful create ETH ledger account
            const currency = "ETH";
            const xpub = serverResponse.data.xpub;
            const externalId = clientEmail;
            tatumcalls
              .createLedgerAccount(currency, xpub, externalId)
              .then()
              .catch((err) => {
                console.log(err);
              });
          } else console.log(serverResponse);
        })

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
    const url = `${process.env.TATUM_BASE_URL}/bsc/wallet`;
    try {
      const options = {
        method: "GET",
        headers: {
          "x-api-key": process.env.TATUM_API_KEY,
        },
        url,
      };
      //step 2
      //try creating the BSC account
      await axios(options)
        .then(async (serverResponse) => {
          if (serverResponse.data !== null) {
            console.log(serverResponse.data);
            //if successful create BSC ledger account
            const currency = "BSC";
            const xpub = serverResponse.data.xpub;
            const externalId = clientEmail;
            tatumcalls
              .createLedgerAccount(currency, xpub, externalId)
              .then()
              .catch((err) => {
                console.log(err);
              });
          } else console.log(serverResponse);
        })

        //create ethereum
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
  },

  //BNB BEACON CHAIN XPUB
  createBNBWallet: async function (clientEmail) {
    //step 1
    const url = `${process.env.TATUM_BASE_URL}/bnb/account`;
    try {
      const options = {
        method: "GET",
        headers: {
          "x-api-key": process.env.TATUM_API_KEY,
        },
        url,
      };
      //step 2
      //try creating the BNB account
      await axios(options)
        .then(async (serverResponse) => {
          if (serverResponse.data !== null) {
            console.log(serverResponse.data);
            //if successful create BNB ledger account
            const currency = "BNB";
            const xpub = serverResponse.data.xpub;
            const externalId = clientEmail;
            tatumcalls
              .createLedgerAccount(currency, xpub, externalId)
              .then()
              .catch((err) => {
                console.log(err);
              });
          } else console.log(serverResponse);
        })

        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
  },

  //DOGE WALLET XPUB
  createDOGEWallet: async function (clientEmail) {
    //step 1

    const url = `${process.env.TATUM_BASE_URL}/dogecoin/wallet`;
    try {
      const options = {
        method: "GET",
        headers: {
          "x-api-key": process.env.TATUM_API_KEY,
        },
        url,
      };
      //step 2
      //try creating the DOGE account
      await axios(options)
        .then(async (serverResponse) => {
          if (serverResponse.data !== null) {
            console.log(serverResponse.data);
            //if successful create DOGE ledger account
            const currency = "DOGE";
            const xpub = serverResponse.data.xpub;
            const externalId = clientEmail;
            tatumcalls
              .createLedgerAccount(currency, xpub, externalId)
              .then()
              .catch((err) => {
                console.log(err);
              });
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
