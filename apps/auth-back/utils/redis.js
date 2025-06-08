const redis = require('redis');
const config = require('../config');
const redisClient = redis.createClient({ url: config.redis.url });

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
})

redisClient.connect();

module.exports = redisClient;