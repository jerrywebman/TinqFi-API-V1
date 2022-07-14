const jwt = require("jsonwebtoken");
const { createClient } = require("redis");

module.exports = async function (req, res, next) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    //connect redis connection
    const client = createClient({
      url: process.env.REDIS_URL,
      socket: {
        tsl: true,
        rejectUnauthorized: false,
      },
    });

    client.on("error", (err) => console.log("Redis Client Error", err));

    client.connect();

    var token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET, async function (err, decoded) {
      if (err)
        res.status(400).json({
          success: false,
          msg: "Invalid User credentials, please try again or log in.",
        });
      else {
        const redisToken = await client.get(decoded.user.email);
        const redisTtl = await client.ttl(decoded.user.email);
        if (!redisToken)
          return res.status(400).json({
            success: false,
            msg: "Token Expired, please log in.",
          });
        else if (redisToken && redisTtl < 180)
          return res.status(400).json({
            success: false,
            msg: "Token Expires in less than 3 mins time, please log in again.",
          });
        else {
          req.user = decoded.user;
          next();
        }
      }
    });
  } else {
    return res
      .status(400)
      .json({ success: false, msg: "Access Denied/User not found" });
  }
};
