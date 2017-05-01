/**
 * Created by Neferpitou on 2017/3/26.
 */
var express = require('express');
var path = require('path');

var app =express();

app.set('view engine','ejs');
app.set('views','./views');


//app.use(express.static('public'));                 //将静态资源文件所在的目录作为参数传递给 express.static 中间件就可以提供静态资源文件的访问了    如: /style.css
app.use('/public',express.static('public'));         //为静态资源目录指定一个挂载路径      如: /public/style.css


function getNewsList() {
    var list =[];
    for(var i=0;i<5;i++){
        list.push(getNewsById(i+1));
    }
    return list;
}

function getNewsById(id) {
    return{
        id:id,
        title:'第'+id+'篇新闻标题',
        content:'第'+id+'篇新闻内容'
    };
}

app.get('/',function (req,res) {
    res.render('index.ejs',{
        list:getNewsList()
    });
});

app.get('/news/:id',function (req,res){           // :id 的意思是id是一个变量
    res.render('news.ejs',{
        news:getNewsById(req.params.id)
    });
});

app.listen(3000);