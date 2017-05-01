/**
 * Created by Neferpitou on 2017/3/26.
 */

var http = require('http');
var parseUrl =require('url').parse;
var connect = require('connect');

var NEWS ={
    1: '第一篇新闻的内容',
    2: '第二篇新闻的内容',
    3: '第三篇新闻的内容'
};
function getNews(id) {
    return NEWS[id] || '文章不存在';
}

var app = connect();

//开始一系列的中间件队列，用next传递
app.use(function (req,res,next) {
    res.send = function send(html) {            //重写send函数
        res.writeHead(200,{
            'content-type':'text/html;charset=utf-8'
        });
        res.end(html);
    }
    next();
});

app.use(function (req,res,next) {
    var info = parseUrl(req.url,true);          //解析请求的url
    req.pathname = info.pathname;
    req.query = info.query;
    next();
});

app.use(function (req,res,next) {
    if(req.pathname === '/'){
        res.send('<ul>'+
            '<li><a href="/news?type=1&id=1">新闻一</a></li>'+
            '<li><a href="/news?type=1&id=2">新闻二</a></li>'+
            '<li><a href="/news?type=1&id=3">新闻三</a></li>'+
            '</ul>');
    }else{     //若路径不为'/'时，才next到下一个use队列里
        next();
    }
});
app.use(function (req,res,next) {
    if(req.pathname ==='/news' && req.query.type ==='1'){
        res.send(getNews(req.query.id));
    }else{
        next();
    }
});

app.use(function (req,res,next) {
    res.end('<h1>文章不存在！</h1>');
});

app.listen(3000);