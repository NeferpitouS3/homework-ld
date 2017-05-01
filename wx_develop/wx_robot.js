/**
 * Created by Neferpitou on 2017/3/16.
 */

var wechat  = require('wechat');
var express = require('express');
var http = require('http');
var querystring = require('querystring');
//创建express框架的对象
var app = express();
var config = {
    token: 'sspku',
    appid: 'wx4a056b3e16bf1037'
};
//将接受到的option等信息进行querystring处理
app.use(express.query());
//当访问的路由是'/'时，便调用wechat函数
//wechat函数里根据config内容，每接收到一次信息便调用后面的回调函数
app.use('/', wechat(config, function (req, res) {
    // 微信输入信息都在req.weixin上
    var message = req.weixin;
    console.log(message);
    if(message.EventKey=='robot4chat'){               //处理点击菜单的请求
        res.reply('快开始和我聊天呀！');
    }else if(message.EventKey=='tryclick'){
        res.reply('别点了，快开始和我聊天呀！');
    }else{
        getReply(message.Content,function (data) {    //处理用户和聊天机器人的对话
            res.reply(data);
        });
    }
}));
app.listen(9529);

var getReply =function (info,callback) {
    var post_data = querystring.stringify({
        key: '5905fc7af0a74805b98e03bce16ca257',
        info: info
    });
    var options = {
        host: 'www.tuling123.com',
        port: 80,
        path: '/openapi/api',
        method: 'POST',
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded'
        }
    };

    //根据options接收来自该api的数据
    var req = http.request(options, function (res) {
        var str='';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            str+=chunk;
        }).on('end',function () {
            console.log('robot reply:'+JSON.parse(str)["text"]);
            callback(JSON.parse(str)["text"]);             //将获得的会话内容回调给微信，让微信将其返回给用户
        });
    });
    //把用户的会话内容传送给api，然后在request里接收机器人api返回的信息
    req.write(post_data);
    req.end();
}