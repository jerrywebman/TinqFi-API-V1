const axios = require("axios");
var AddressStore = require("../models/address");
var User = require("../models/user");

exports.createLedgerAccount = async function (currency, xpub, externalId) {
  try {
    const url = `${process.env.TATUM_BASE_URL}/ledger/account`;
    const formData = {
      currency,
      xpub,
      customer: {
        externalId,
        accountingCurrency: "USD",
        customerCountry: "NG",
        providerCountry: "NG",
      },
      accountingCurrency: "USD",
    };

    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.TATUM_API_KEY,
      },
      url,
      data: formData,
    };
    //step 2 contd.
    //try creating the token offchain account
    const ledgerresponse = await axios(options)
      .then((serverResponse) => {
        if (serverResponse.data) {

          // console.log("Customer acount details", serverResponse.data);
          const ledgerAccountDetails = serverResponse.data;
          const callthis = async (id) => {
            const url = `${process.env.TATUM_BASE_URL}/offchain/account/${id}/address`;
            const options = {
              method: "POST",
              headers: {
                "content-type": "application/json",
                "x-api-key": process.env.TATUM_API_KEY,
              },
              url,
            };
            //try creating the token offchain address
            const accntresponse = await axios(options)
              .then((offchainServerResponse) => {
                if (offchainServerResponse.data !== null) {
                  //store the addresses in the database
                  // console.log(
                  //   "Customer offchainServerResponse",
                  //   offchainServerResponse.data
                  // );


                  //UPDATE THE CUSTOMER ADDRESS DB
                  const addAddress = AddressStore.updateOne(
                    { userEmail: externalId },
                    {
                      $set: {
                        ourCustomerTatumId:
                          ledgerAccountDetails.customerId,
                      },
                      $push: {
                        onRegistration: {
                          tokenAccountId: ledgerAccountDetails.id,
                          derivationKey:
                            offchainServerResponse.data.derivationKey,
                          currency:
                            offchainServerResponse.data.currency,
                          address: offchainServerResponse.data.address,
                        },
                      },
                    }
                  ).then(async () => {
                    //UPDATE THE CUSTOMER USER PROFILE DB

                    const addTatumUserID = await User.updateOne(
                      { email: externalId },
                      {
                        $set: {
                          ourCustomerTatumId:
                            ledgerAccountDetails.customerId,
                        },
                        $push: {
                          onRegistrationLedgerAccnts: {
                            tokenAccountId: ledgerAccountDetails.id,
                            tokenAccountcurrency:
                              ledgerAccountDetails.currency,
                            createdAt: Date.now(),
                          },
                        },
                      }
                    );

                  });

                }

              })
              .catch(function (err) {
                return {
                  success: false,
                  message: err.response.data.message
                };
              });

          };
          callthis(serverResponse.data.id);
        }
        return serverResponse;
      })
      .catch(function (err) {
        return {
          success: false,
          message: err.response.data.message
        };
      });
    return {
      success: ledgerresponse.data.active,
      message: `${currency} wallet created successfully`
    };

  } catch (error) {
    return {
      success: false,
      // statusCode: 500,
      message: `Server error`,
    };
  }
};

exports.createLedgerAccountWithoutXpub = async function (currency, wallet, externalId) {
  try {
    const url = `${process.env.TATUM_BASE_URL}/ledger/account`;
    const formData = {
      currency,
      customer: {
        externalId,
        accountingCurrency: "USD",
        customerCountry: "NG",
        providerCountry: "NG",
      },
      accountingCurrency: "USD",
    };

    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.TATUM_API_KEY,
      },
      url,
      data: formData,
    };
    //step 2 contd.
    //try creating the token offchain account
    const ledgerresponse = await axios(options)
      .then((serverResponse) => {
        if (serverResponse.data) {

          // console.log("Customer acount details", serverResponse.data);
          const ledgerAccountDetails = serverResponse.data;
          console.log(serverResponse.data);
          const callthis = async (id) => {
            const url = `${process.env.TATUM_BASE_URL}/offchain/account/${id}/address/${wallet}`;
            const options = {
              method: "POST",
              headers: {
                "content-type": "application/json",
                "x-api-key": process.env.TATUM_API_KEY,
              },
              url,
            };
            //try creating the token offchain address
            const accntresponse = await axios(options)
              .then((offchainServerResponse) => {
                if (offchainServerResponse.data !== null) {
                  //UPDATE THE CUSTOMER ADDRESS DB
                  const addAddress = AddressStore.updateOne(
                    { userEmail: externalId },
                    {
                      $set: {
                        ourCustomerTatumId:
                          ledgerAccountDetails.customerId,
                      },
                      $push: {
                        onRegistration: {
                          tokenAccountId: ledgerAccountDetails.id,
                          derivationKey:
                            offchainServerResponse.data.derivationKey,
                          currency:
                            offchainServerResponse.data.currency,
                          address: offchainServerResponse.data.address,
                        },
                      },
                    }
                  ).then(async () => {
                    //UPDATE THE CUSTOMER USER PROFILE DB

                    const addTatumUserID = await User.updateOne(
                      { email: externalId },
                      {
                        $set: {
                          ourCustomerTatumId:
                            ledgerAccountDetails.customerId,
                        },
                        $push: {
                          onRegistrationLedgerAccnts: {
                            tokenAccountId: ledgerAccountDetails.id,
                            tokenAccountcurrency:
                              ledgerAccountDetails.currency,
                            createdAt: Date.now(),
                          },
                        },
                      }
                    );

                  });

                }

              })
              .catch(function (err) {
                return {
                  success: false,
                  message: err.response.data.message
                };
              });

          };
          callthis(serverResponse.data.id);
        }
        return serverResponse;
      })
      .catch(function (err) {
        return {
          success: false,
          message: err.response.data.message
        };
      });
    return {
      success: ledgerresponse.data.active,
      message: `${currency} wallet created successfully`
    };

  } catch (error) {
    return {
      success: false,
      // statusCode: 500,
      message: `Server error`,
    };
  }
};

