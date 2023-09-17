const express = require("express");
require("dotenv").config();
const webhooksActions = require("../methods/webhooksActions");

const verify = require("../middleware/verifyToken");

const router = express.Router();

//WALLETS ROUTES

//GET ALL ACCOUNTS
router.post(
  "/api/v1/webhooks/get",
  webhooksActions.getWebhooks
);

//SET WEBHOOK SUBSCRIPTIONS
router.post(
  "/api/v1/webhooks/set",
  verify,
  webhooksActions.setWebhooks
);

module.exports = router;


// [
//   {
//     "id": "65073cffd0feea64a9138a90",
//     "subscriptionId": "6506ad19a0751dce87da529d",
//     "url": "https://tinqfi.cyclic.app/api/v1/webhooks/get",
//     "type": "INCOMING_BLOCKCHAIN_HOOK",
//     "data": {
//       "accountId": "632cec963c281051123c8d95",
//       "subscriptionType": "ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION",
//       "amount": "0.1",
//       "reference": "b80b3a74-3a42-416d-a13e-196cc46edcc6",
//       "currency": "BSC",
//       "txId": "0xad939d8710b83bc9f604a91dbef4a442a77e4beb7376275ed21c691ffede187c",
//       "blockHeight": 33425372,
//       "blockHash": "0xaf2cc89c3d48fa653db9590d7a3a482bb87a58b498c0dcd5c9eb93e2774b667d",
//       "from": "0xaa25aa7a19f9c426e07dee59b12f944f4d9f1dd3",
//       "to": "0xfad5cbc365d96de6ae5b9e6c5e45511f73e41de6",
//       "date": 1694973004129,
//       "index": null
//     },
//     "nextTime": 1694973178967,
//     "timestamp": 1694973183000,
//     "retryCount": 2,
//     "failed": true,
//     "response": {
//       "code": 404,
//       "data": "\"<!DOCTYPE html>\\n<html lang=\\\"en\\\">\\n<head>\\n<meta charset=\\\"utf-8\\\">\\n<title>Error</title>\\n</head>\\n<body>\\n<pre>Cannot POST /api/v1/webhooks/get</pre>\\n</body>\\n</html>\\n\"",
//       "networkError": false
//     }
//   },
//   {
//     "id": "65073c7fd0feea64a91385b2",
//     "subscriptionId": "6506ad19a0751dce87da529d",
//     "url": "https://tinqfi.cyclic.app/api/v1/webhooks/get",
//     "type": "INCOMING_BLOCKCHAIN_HOOK",
//     "data": {
//       "accountId": "632cec963c281051123c8d95",
//       "subscriptionType": "ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION",
//       "amount": "0.1",
//       "reference": "b80b3a74-3a42-416d-a13e-196cc46edcc6",
//       "currency": "BSC",
//       "txId": "0xad939d8710b83bc9f604a91dbef4a442a77e4beb7376275ed21c691ffede187c",
//       "blockHeight": 33425372,
//       "blockHash": "0xaf2cc89c3d48fa653db9590d7a3a482bb87a58b498c0dcd5c9eb93e2774b667d",
//       "from": "0xaa25aa7a19f9c426e07dee59b12f944f4d9f1dd3",
//       "to": "0xfad5cbc365d96de6ae5b9e6c5e45511f73e41de6",
//       "date": 1694973004129,
//       "index": null
//     },
//     "nextTime": 1694973049788,
//     "timestamp": 1694973055000,
//     "retryCount": 1,
//     "failed": true,
//     "response": {
//       "code": 404,
//       "data": "\"<!DOCTYPE html>\\n<html lang=\\\"en\\\">\\n<head>\\n<meta charset=\\\"utf-8\\\">\\n<title>Error</title>\\n</head>\\n<body>\\n<pre>Cannot POST /api/v1/webhooks/get</pre>\\n</body>\\n</html>\\n\"",
//       "networkError": false
//     }
//   },
//   {
//     "id": "65073c50d0feea64a9138323",
//     "subscriptionId": "6506ad19a0751dce87da529d",
//     "url": "https://tinqfi.cyclic.app/api/v1/webhooks/get",
//     "type": "INCOMING_BLOCKCHAIN_HOOK",
//     "data": {
//       "accountId": "632cec963c281051123c8d95",
//       "subscriptionType": "ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION",
//       "amount": "0.1",
//       "reference": "b80b3a74-3a42-416d-a13e-196cc46edcc6",
//       "currency": "BSC",
//       "txId": "0xad939d8710b83bc9f604a91dbef4a442a77e4beb7376275ed21c691ffede187c",
//       "blockHeight": 33425372,
//       "blockHash": "0xaf2cc89c3d48fa653db9590d7a3a482bb87a58b498c0dcd5c9eb93e2774b667d",
//       "from": "0xaa25aa7a19f9c426e07dee59b12f944f4d9f1dd3",
//       "to": "0xfad5cbc365d96de6ae5b9e6c5e45511f73e41de6",
//       "date": 1694973004129,
//       "index": null
//     },
//     "timestamp": 1694973008000,
//     "failed": true,
//     "response": {
//       "code": 404,
//       "data": "\"<!DOCTYPE html>\\n<html lang=\\\"en\\\">\\n<head>\\n<meta charset=\\\"utf-8\\\">\\n<title>Error</title>\\n</head>\\n<body>\\n<pre>Cannot POST /api/v1/webhooks/get</pre>\\n</body>\\n</html>\\n\"",
//       "networkError": false
//     }
//   }
// ]