const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const session = require("express-session");
const redis = require('redis');
const redisClient = redis.createClient();
const redisStore = require('connect-redis')(session);
const router = require("./routes");

const app = express();
//redis
redisClient.on('error', (err) => {
    console.log('Redis error: ', err);
});
//session
app.use(session({
    secret: 'ThisIsHowYouUseRedisSessionStorage',
    name: '_redisPractice',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Note that the cookie-parser module is no longer needed
    store: new redisStore({ host: 'localhost', port: 6379, client: redisClient, ttl: 86400 }),
}));
//body parser
app.use(bodyParser.urlencoded({extended: true}));
//views
app.use(express.static(__dirname + "/views"));
//css
app.use(express.static(__dirname + "/assets"));
//ejs
app.set('view engine', 'ejs');
//routes
app.use(router);

//port
const server = app.listen(8000, function() {
	console.log("listening on port 8000");
});