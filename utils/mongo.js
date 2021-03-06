const MongoClient = require('mongodb').MongoClient;

module.exports.addUser = function(input_user){

    return new Promise((resolve, reject) => {
        const client = new MongoClient(process.env.MONGODB_CON_STRING, { useNewUrlParser: true });
        client.connect(err => {
            // console.log("Mongo connected");
            const users = client.db(process.env.MONGODB).collection("users");
            users.insertOne(input_user, function(err, result){
                client.close();
                resolve(result);
            });
        });
    });
}

module.exports.getAllUsers = function(username){

    return new Promise((resolve, reject) => {
        const client = new MongoClient(process.env.MONGODB_CON_STRING, { useNewUrlParser: true });
        client.connect(err => {
            // console.log("Mongo connected");
            const users = client.db(process.env.MONGODB).collection("users");
            users.find({"username": {$ne: username}}, { projection: { _id: 1, username: 1} }).toArray(function(err, result){
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
            // console.log("Mongo connected");
            const users = client.db(process.env.MONGODB).collection("users");
            users.findOne(input_user, function(err, result){
                client.close();
                // console.log(result);
                resolve(result);
            });
        });
    });
}

module.exports.getAllMessages = function(u1, u2){
    // console.log(u1, u2);
    return new Promise((resolve, reject) => {
        const client = new MongoClient(process.env.MONGODB_CON_STRING, { useNewUrlParser: true });
        client.connect(err => {
            // console.log("Mongo connected");
            const messages = client.db(process.env.MONGODB).collection("messages");
            messages.find({$or: [{"to":u1, "from":u2}, {"to":u2, "from":u1}]}).sort({"ts":1}).toArray(function(err, result){
                client.close();
                // console.log(result);
                resolve(result);
            });
        });
    });
}

module.exports.addMessage = function(input_message){

    return new Promise((resolve, reject) => {
        const client = new MongoClient(process.env.MONGODB_CON_STRING, { useNewUrlParser: true });
        client.connect(err => {
            // console.log("Mongo connected");
            const messages = client.db(process.env.MONGODB).collection("messages");
            messages.insertOne(input_message, function(err, result){
                client.close();
                resolve(result);
            });
        });
    });
}