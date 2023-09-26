const axios = require("axios");
const redisClient = require("../middleware/init_redis");

const getAllCurrentTokenPrice = async () => {
    try {
        //CHECK IF REDIS DATA IS AVAILABLE AND WILL NOT EXPIRE IN 20 SEC
        const redisTtl = await redisClient.ttl("allPriceData");
        if (!redisTtl || redisTtl < 20) {
            const res = await axios
                .get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2Cethereum%2Cdogecoin%2Cbinancecoin%2Cbinance-usd&page=1", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then(async function (response) {
                    const responseFromGecko = await response.data;
                    //Save data to Redis
                    redisClient.set("allPriceData", JSON.stringify(responseFromGecko));
                    redisClient.expire("allPriceData", 300);
                    return priceData;
                })
                .catch(function (error) {
                    return error.response.data;
                });
            return res;
        }
        else {
            const data = await redisClient.get("allPriceData");
            return JSON.parse(data);
        }
    } catch (error) {
        return {
            success: false,
            message: "Price Data Network failed",
        };
    }
}

module.exports = getAllCurrentTokenPrice;