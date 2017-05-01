//message.js

var PORT = 9529;
var http = require('http');
var qs = require('qs');
var TOKEN = 'sspku';

//该方法只需要运行一次即可
// function checkSignature(params, token){
//     //1. 将token、timestamp、nonce三个参数进行字典序排序
//     //2. 将三个参数字符串拼接成一个字符串进行sha1加密
//     //3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
//
//     var key = [token, params.timestamp, params.nonce].sort().join('');
//     var sha1 = require('crypto').createHash('sha1');
//     sha1.update(key);
//     return  sha1.digest('hex') == params.signature;
// }

//根据接受的信息，以微信的格式发送信息
function replyText(msg){
    if(msg.xml.MsgType[0] !== 'text' && msg.xml.EventKey[0]!='shanshan'){
        return '';
    }

    //将要返回的消息通过一个简单的tmpl模板（npm install tmpl）返回微信
    var tmpl = require('tmpl');
    var replyTmpl = '<xml>' +
        '<ToUserName><![CDATA[{toUser}]]></ToUserName>' +
        '<FromUserName><![CDATA[{fromUser}]]></FromUserName>' +
        '<CreateTime><![CDATA[{time}]]></CreateTime>' +
        '<MsgType><![CDATA[{type}]]></MsgType>' +
        '<Content><![CDATA[{content}]]></Content>' +
        '</xml>';
    if(msg.xml.Content[0] == '你好哈'){
        return tmpl(replyTmpl, {
            toUser: msg.xml.FromUserName[0],
            fromUser: msg.xml.ToUserName[0],
            type: 'text',
            time: Date.now(),
            content: '你更哈'
        });
    }
    //微信发送信息的格式
    return tmpl(replyTmpl, {
        toUser: msg.xml.FromUserName[0],
        fromUser: msg.xml.ToUserName[0],
        type: 'text',
        time: Date.now(),
        content: '你好哈'
    });
}

var server = http.createServer(function (request, response) {

    //解析URL中的query部分，用qs模块(npm install qs)将query解析成json
    var query = require('url').parse(request.url).query;
    var params = qs.parse(query);

    if (request.method == "GET") {
        //如果请求是GET，返回echostr用于通过服务器有效校验
        response.end(params.echostr);
    } else {
        //否则是微信给开发者服务器的POST请求
        var postdata = "";

        request.addListener("data", function (postchunk) {
            postdata += postchunk;
        });

        //获取到了POST数据
        request.addListener("end",function(){
            var parseString = require('xml2js').parseString;

            parseString(postdata, function (err, result) {
                if(!err){
                    var res = replyText(result);
                  	console.log(result);
					response.end(res);
                }
            });
        });
    }
});

server.listen(PORT);

console.log("Server runing at port: " + PORT + ".");			
