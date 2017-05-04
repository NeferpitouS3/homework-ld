/**
 * Created by Neferpitou on 2017/4/25.
 */

var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();

app.use(cookieParser('saddsafwerqsdaf'));

app.get('/read',function (req,res,next) {
    res.json(req.cookies);
});

app.get('/abc',function (req,res,next) {
    res.json(req.cookies);
});

app.get('/write',function (req, res, next) {
    // res.cookie('my_cookie','hello',{
    //     // expires:new Date(Date.now() + 10*1000)    两种设置Cookie失效时间的办法
    //     maxAge: 10*1000
    // });
    // document.cookie获取不到
    res.cookie('a','123');
    res.cookie('b','456',{httpOnly:true,signed:true});
    res.json(req.cookies);
    //res.json(req.signedCookies);      //输出有签名的cookie
});

app.listen(3000);
console.log('start!');








