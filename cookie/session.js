/**
 * Created by Neferpitou on 2017/5/3.
 */

var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
var uuid = require('uuid')
var cookieParser = require('cookie-parser')
var clone = require('clone')

var app = express()

//因为express-session的存储是基于cookie的，所以换为不同的浏览器没有继承session
function my_session() {
    var data ={};
    return function (req,res,next) {
        var id = req.signedCookies.session_id || uuid.v4();        //第一次调用时用uuid.v4()生成一个id，接下来都从cookie中读取该id
        res.cookie('session_id',id,{
            maxAge:600000,
            path:'/',
            httpOnly:true,
            signed:true
        });
        req.session = clone(data[id] || {});             //第一次调用时,req.session为{},接下来每次调用此时的req.session都为上一次的data[id]
        res.on('finish',function () {
            console.log('save session :',req.session);  //finish时,系统已经把view,num等存入req.session里了
            data[id] = clone(req.session);
        });
        next();
    }
}

//挂载express-session中间件到所有路径,每次请求都被执行
// app.use(session({
//     secret:'keyboard cat',
//     resave:false,                 //指每次请求都重新设置session cookie，假设你的cookie是10分钟过期，每次请求都会再设置10分钟
//     saveUninitialized:true        //指无论有没有session cookie，每次请求都设置个session cookie
// }));

app.use(cookieParser('asdasdqweqwe'));
app.use(my_session());

app.use(function (req,res,next) {
    var views = req.session.views;
    if(!views){
        views = req.session.views = {};
    }
    //解析出路径名
    var pathname = parseurl(req).pathname;
    //计算访问次数
    views[pathname] = (views[pathname] || 0)+1;
    next();
});

app.use('/',function (req,res,next) {
    var num = req.session.num
    if(!num){
        num = req.session.num = 0
    }
    req.session.num = num +1
    console.log('=====这是第'+req.session.num+'次调用=====')
    next()
})

/*
app.use(function (req,res,next) {
    console.log("......")
    console.log("我是一个中间件，每次请求到我都被执行，可是我什么都不干，直接调用next~~")
    next()
})

app.use(function (req,res,next) {
    console.log("......")
    console.log("我是另一个中间件，可是我的代码段中还是只有next，请在next之间加点代码吧")
    next()
})
*/


app.get('/foo',function (req,res,next) {
    res.send('you viewed this page '+req.session.views['/foo']+' times');
});

app.get('/bar',function (req,res,next) {
    res.send('you viewed this page '+req.session.views['/bar']+' times');
});
app.listen(3000);
console.log('start~')