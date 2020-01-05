var express = require('express');
var mongo = require('../utils/mongo');
var jwt = require('jsonwebtoken');
var middleware = require('../utils/middleware');

var router = express.Router();

router.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, token');

	if ('OPTIONS' === req.method) {
		res.sendStatus(200);
	}
	else{
        next();
    }
});

router.post('/addUser', function(req, res){
    // console.log(req.body);
    if(req.body.username.match(/^[\d\w_]{4,32}$/) && req.body.password.match(/^[\d\w!@#$%^&*(){}[\];"'.,+-=]{6,128}$/)){
        mongo.addUser({
            username: req.body.username,
            password: req.body.password
        }).then(result => {
            // console.log("result1");
            if(result===null) res.json({"success":false, "message": "User already exists"});
            else {
                res.json({"success":true, "message": "user created", "userId": result.insertedId});
            }
        }).catch(err => {
            res.json({"success":false, "message": "Internal error"});
        });
    }
    else{
        res.json({"success":false, "message": "Wrong format of username and password"});
    }
});

router.get('/getAllUsers', middleware.authenticate, function(req, res){
    mongo.getAllUsers(req.user.username)
    .then(result => {
        res.json({"success":true, "message": "all users fetched", "users": result});
    }).catch(err => {
        res.json({"success":false, "message": "Internal error"});
    });
});

router.post('/login', function(req, res){
    // console.log(req.body);
    mongo.getUser({
        username: req.body.username,
        password: req.body.password
    }).then(result => {
        if(result===null) res.json({"success":false, "message": "no such user exists"});
        else{
            var token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (30 * 60),
                user: {
                    username: result.username,
                    _id: result._id
                }
            }, process.env.JWT_SECRET);
            res.json({"success":true, "message": "login successfull", "token": token});
        }
    }).catch(err => {
        res.json({"success":false, "message": "Internal error"});
    });
});

router.get('/getAllMessages/:username',  middleware.authenticate, function(req, res){
    // console.log(req.params.username);
    if(req.params.username!=null){
        mongo.getAllMessages(req.user.username, req.params.username)
        .then(result => {
            res.json({"success":true, "message": "all messages fetched", "messages": result});
        }).catch(err => {
            res.json({"success":false, "message": "Internal error"});
        });
    }
    else{
        res.json({"success":false, "message": "Bad Request"});
    }
});

router.get('/verifyToken', middleware.authenticate, function(req, res){
    res.json({status: true});
});

module.exports = router;