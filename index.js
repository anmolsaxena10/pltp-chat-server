require('dotenv').config();
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
const MongoClient = require('mongodb').MongoClient;

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

    // const client = new MongoClient(process.env.MONGODB_CON_STRING, { useNewUrlParser: true });
    // client.connect(err => {
    //     console.log("connected");
    // const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    // client.close();
    // });

    
    console.log("connected");
    app.get('/', function (req, res) {
		res.send('Hello! The API is at http://localhost:' + port + '/api');
	});

    var server = app.listen(port);
    console.log('Listening at http://localhost:' + port);
    
});