const axios = require("axios");
const redisClient = require("../middleware/init_redis");

const getCurrentTokenPrice = async () => {
    try {
        //CHECK IF REDIS DATA IS AVAILABLE AND WILL NOT EXPIRE IN 20 SEC
        const redisTtl = await redisClient.ttl("priceData");
        if (!redisTtl || redisTtl < 20) {
            const res = await axios
                .get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Cdogecoin%2Cbinancecoin%2Cbinancecoin%2Cripple%2Csolana%2Ctron%2Clitecoin%2Cmatic-network&vs_currencies=usd", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then(async function (response) {
                    const responseFromGecko = await response.data;
                    //rearrange the response object
                    const priceData = {
                        BTC: responseFromGecko.bitcoin.usd,
                        ETH: responseFromGecko.ethereum.usd,
                        BSC: responseFromGecko.binancecoin.usd,
                        DOGE: responseFromGecko.dogecoin.usd,
                        SOL: responseFromGecko.solana.usd,
                        LTC: responseFromGecko.litecoin.usd,
                        TRON: responseFromGecko.tron.usd,
                        MATIC: responseFromGecko["matic-network"].usd,
                    }
                    //Save data to Redis
                    redisClient.set("priceData", JSON.stringify(priceData));
                    redisClient.expire("priceData", 900);
                    return priceData;
                })
                .catch(function (error) {
                    return error.response.data;
                });
            return res;
        }
        else {
            const data = await redisClient.get("priceData");
            return JSON.parse(data);
        }
    } catch (error) {
        return {
            success: false,
            message: "Price Data Network failed",
        };
    }
}

module.exports = getCurrentTokenPrice;