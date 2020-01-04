var redis = require('redis');
var promise = require('bluebird');

promise.promisifyAll(redis.RedisClient.prototype);
promise.promisifyAll(redis.Multi.prototype);

module.exports = function(){
	return new Promise((resolve, reject) => {
		let connector = redis.createClient({
            port    : process.env.REDIS_PORT,
            host    : process.env.REDIS_HOST,
            password: process.env.REDIS_PASSWORD
        });

		connector.on("error", () => {
			reject("Redis Connection failed");
		});

		connector.on("connect", () => {
			resolve(connector);
		});
	});
};