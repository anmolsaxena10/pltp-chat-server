require('dotenv').config();
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var jwt = require('jsonwebtoken');

var socket = require('socket.io');
var redisAdapter = require('socket.io-redis');
var red = require('redis');

var router = require('./api/index');
var redisClient = require('./utils/redis');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(morgan('dev'));

var port = process.env.PORT
redisClient().then(function(redis){
    
    console.log("connected");
    app.get('/', function (req, res) {
		res.send('Hello! The API is at http://localhost:' + port + '/api');
	});

    app.use('/api', router);

    var server = app.listen(port);
    console.log('Listening at http://localhost:' + port);
    
    var io = socket.listen(server);
    
    io.use(function(socket, next){
        let token = socket.handshake.query.token;
        try{
            if (decoded = jwt.verify(token, process.env.JWT_SECRET)) {
                socket.username = decoded.user.username;
                return next();
            }
        }
        catch{
            return next(new Error('authentication error'));
        }
    });

    io.on("connection", function(socket){
        console.log("Socket connected "+ socket.username);
        redis.subscribe(socket.username + ":channel");

        socket.on('message', function(message){
            // helper.publishMessage(data);
            message.from = socket.username;
            socket.emit("message", message);
            const pub = red.createClient({
                port    : process.env.REDIS_PORT,
                host    : process.env.REDIS_HOST,
                password: process.env.REDIS_PASSWORD
            });
            pub.publish(message.to + ":channel", JSON.stringify(message));
            console.log(message.to + ":channel");
			console.log("message ", message);
        });

        socket.on('disconnect', function () {
			console.log(socket.username + ' disconnected');
        });
        
        redis.on("message", (channel, message) => {
            let chName = socket.username + ":channel";
            console.log("afdsfsdf redis");
			if (channel === chName) {
				socket.emit("message", JSON.parse(message));
			}
		});
    });
});