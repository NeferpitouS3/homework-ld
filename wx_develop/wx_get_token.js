/**
 * Created by Neferpitou on 2017/3/15.
 */

var later = require('later');
var https = require('https');
var fs = require('fs');

var appid = "wx4a056b3e16bf1037";
var appsecret = "c8f431ffc5d2fb5a1a7504e3181d06fa";
var access_token;

later.date.localTime();
var sched = later.parse.recur().every(1).hour();
var timer = later.setInterval(test, sched);           //设置监听器，每一小时运行一次
setTimeout(test, 2000);

function test() {
    console.log("Now: "+new Date());
    //根据options来获取access_token
    var options = {
        hostname: 'api.weixin.qq.com',
        path: '/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + appsecret
    };
    //get请求
    var req = https.get(options, function (res) {
        var bodyChunks = '';
        res.on('data', function (chunk) {
            bodyChunks += chunk;
        });
        res.on('end', function () {
            var body = JSON.parse(bodyChunks);
            if (body.access_token) {
                access_token = body.access_token;
                var options = {encoding:'utf8',flag:'w'};
                fs.writeFile('token.txt',access_token,options);           //将获取到的access_token存入当前文件夹内的token.txt文件内
                console.log(access_token);
            } else {
                console.dir(body);
            }
        });
    });
    req.on('error', function (e) {
        console.log('ERROR: ' + e.message);
    });
}
