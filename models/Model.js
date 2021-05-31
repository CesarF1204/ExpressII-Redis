class Model {
    constructor() {
        this.redis = require('redis');
        this.client = this.redis.createClient();
        this.client.on('error', function (err) {
            console.log('Error ' + err)
        });

        const express = require('express');
        const session = require('express-session');
        const app = express();
        app.use(session({
            secret: 'RedisSessionStorage',
            name: 'redis_session',
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false }, // Note that the cookie-parser module is no longer needed
        }));
        this.session = session;
    }
}
module.exports = Model;