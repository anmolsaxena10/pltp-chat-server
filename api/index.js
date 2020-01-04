var express = require('express');
var mongo = require('../utils/mongo');

var router = express.Router();

router.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

	if ('OPTIONS' === req.method) {
		res.sendStatus(200);
	}
	else{
        next();
    }
});

router.post('/addUser', function(req, res){
    console.log(req.body);
    if(req.body.username.match(/^[\d\w_]{4,32}$/) && req.body.password.match(/^[\d\w!@#$%^&*(){}[\];"'.,+-=]{6,128}$/)){
        mongo.addUser({
            username: req.body.username,
            password: req.body.password
        }).then(result => {
            console.log("result1");
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

router.get('/getAllUsers', function(req, res){
    mongo.getAllUsers()
    .then(result => {
        console.log(result);
        res.json({"success":true, "message": "all users fetched", "users": result});
    }).catch(err => {
        res.json({"success":false, "message": "Internal error"});
    });
});

router.post('/login', function(req, res){
    res.json({'as':'asd'});
});

router.get('/getAllUsers', function(req, res){
    res.json({'as':'asd'});
});

router.get('/getAllMessages', function(req, res){
    res.json({'as':'asd'});
});

module.exports = router;