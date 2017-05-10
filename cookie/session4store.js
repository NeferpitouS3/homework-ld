/**
 * Created by Neferpitou on 2017/5/10.
 */

var express = require('express')
var session = require('express-session')
var fs = require('fs')
var MyFileStore = require("./MyFileStore")(session)           //自定义存储引擎 , 需要传入session


var app = express()


app.use(session({
    secret: 'neferpitous homework',
    resave:false,
    saveUninitialized:true,
    store: new MyFileStore('localSession')                   //express-session的store接口接收 自定义存储引擎, 只接收一个参数即 目录名
}));

app.use('/a',function (req,res,next) {
    var num = req.session.num
    if(!num){
        num = req.session.num = 0
    }
    req.session.num = num +1
    console.log('=====这是第'+req.session.num+'次调用=====')
    res.send('ok')
})



app.listen(3000);
console.log('start~')





