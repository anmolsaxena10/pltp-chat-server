require('dotenv').config();
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');

var socket = require('socket.io');
var redisAdapter = require('socket.io-redis');

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
    
});