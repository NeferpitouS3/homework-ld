/**
 * Created by Neferpitou on 2017/5/2.
 */

var mongoose = require('mongoose');

var connection = mongoose.createConnection('mongodb://localhost:27017/mynode', function (err) {
    if (err) throw err;
});
var Schema = mongoose.Schema;
var schema = new Schema({       //mongodb文档的格式
    name: String,
    passwd: String
});
connection.model('user',schema);
var user = connection.model('user');

var u = new user({
    name: 'WANG2',
    passwd: 'abc',
});
u.save(function (err, ret) {
    if (err) throw err;
    console.log(ret);
});


user.find({},function (err, ret) {
    if (err) throw err;
    console.log(ret);
    connection.close();
});

/*
var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = 'mongodb://localhost:27017/mynode';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    console.log("Connected correctly to server");

    db.collection('user').find({"name":"zhang"}).toArray(function(err,list){
        if(err) throw err;
        console.log(list);
    });
});
*/