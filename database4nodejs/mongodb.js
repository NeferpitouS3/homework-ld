/**
 * Created by Neferpitou on 2017/5/2.
 */

//使用node-mongoose操作MongoDB数据库   mongoose为odm
var mongoose = require('mongoose');

var connection = mongoose.createConnection('mongodb://localhost:27017/mynode', function (err) {
    if (err) throw err;
});
var Schema = mongoose.Schema;
var schema = new Schema({       //mongodb文档的格式
    name: String,
    //passwd: String
});
connection.model('user',schema);   //给model第三个值(collection)就不会在数据文档后自动加s了， 如：connection.model('user',new Schema,'user');
var user = connection.model('user');

// var u = new user({
//     name: 'WANG2',
//     passwd: 'abc',
// });
// u.save(function (err, ret) {
//     if (err) throw err;
//     console.log(ret);
// });


user.find({},function (err, ret) {
    if (err) throw err;
    console.log(ret);
    connection.close();
});


/*
//使用node-mongodb操作MongoDB数据库
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