var jwt = require('jsonwebtoken');

module.exports.authenticate = function(req, res, next){
    try{
        var token = req.headers.token || req.body.token;
        // console.log(token);
        if(token){
            var decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log(decoded);
            req.user = decoded.user;
            next();
        }
        else throw("unauthorized");
    }
    catch(err){
        res.json("unauthorized");
    }
}