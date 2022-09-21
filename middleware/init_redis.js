//for redis
const { createClient } = require("redis");

const client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tsl: true,
    rejectUnauthorized: false,
  },
});

// const client = createClient();

client.on("connect", () => {
  console.log("Client connected to redis...");
});

client.on("ready", () => {
  console.log("Client connected to redis and ready to use...");
});

client.on("error", (err) => console.log("Redis Client Error", err));

client.on("end", () => {
  console.log("Client disconnected from redis");
});

process.on("SIGINT", () => {
  client.quit();
});

client.connect();

module.exports = client;
