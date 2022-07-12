const axios = require("axios");
var AddressStore = require("../models/address");
var User = require("../models/user");

const tatumcalls = {
  //create ledger accounts
  createLedgerAccount: async function (currency, xpub, externalId) {
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
    try {
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
      await axios(options)
        .then((serverResponse) => {
          if (serverResponse.data !== null) {
            console.log("Customer acount details", serverResponse.data);
            const ledgerAccountDetails = serverResponse.data;
            const callthis = async (id) => {
              const url = `${process.env.TATUM_BASE_URL}/offchain/account/${id}/address`;

              try {
                const options = {
                  method: "POST",
                  headers: {
                    "content-type": "application/json",
                    "x-api-key": process.env.TATUM_API_KEY,
                  },
                  url,
                };
                //try creating the token offchain address
                await axios(options)
                  .then((offchainServerResponse) => {
                    if (offchainServerResponse.data !== null) {
                      //store the addresses in the database
                      console.log(
                        "Customer offchainServerResponse",
                        offchainServerResponse.data
                      );

                      try {
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
                                currency: offchainServerResponse.data.currency,
                                address: offchainServerResponse.data.address,
                              },
                            },
                          }
                        ).then(async () => {
                          //UPDATE THE CUSTOMER USER PROFILE DB
                          try {
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
                          } catch (e) {
                            console.log(e);
                          }
                        });
                      } catch (err) {
                        console.log(err);
                      }
                    } else console.log("serverResponse", serverResponse);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } catch (e) {
                console.log(e);
              }
            };
            callthis(serverResponse.data.id);
          } else console.log("serverResponse", serverResponse);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
  },
};

module.exports = tatumcalls;
