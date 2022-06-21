require("dotenv/config");

module.exports = {
  secret: process.env.TOKEN_SECRET,
  database: process.env.DATABASE_URL,
};
