const MongoClient = require('mongodb').MongoClient;

module.exports.addUser = function(input_user){

    return new Promise((resolve, reject) => {
        const client = new MongoClient(process.env.MONGODB_CON_STRING, { useNewUrlParser: true });
        client.connect(err => {
            console.log("Mongo connected");
            const users = client.db(process.env.MONGODB).collection("users");
            users.insertOne(input_user, function(err, result){
                client.close();
                resolve(result);
            });
        });
    });
}

module.exports.getAllUsers = function(){

    return new Promise((resolve, reject) => {
        const client = new MongoClient(process.env.MONGODB_CON_STRING, { useNewUrlParser: true });
        client.connect(err => {
            console.log("Mongo connected");
            const users = client.db(process.env.MONGODB).collection("users");
            users.find({}, { projection: { _id: 1, username: 1} }).toArray(function(err, result){
                client.close();
                resolve(result);
            });
        });
    });
}

module.exports.getUser = function(input_user){

    return new Promise((resolve, reject) => {
        const client = new MongoClient(process.env.MONGODB_CON_STRING, { useNewUrlParser: true });
        client.connect(err => {
            console.log("Mongo connected");
            const users = client.db(process.env.MONGODB).collection("users");
            users.findOne(input_user, function(err, result){
                client.close();
                console.log(result);
                resolve(result);
            });
        });
    });
}