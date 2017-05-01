var https = require('https');
var fs = require('fs');
var options={encoding:'utf8',flag:'r'};
var access_token;

var menu = {
    "button": [
	        {
				"type":"view",
				"name":"search",
				"url":"http://www.baidu.com/"
			},
			{
				"name":"子菜单",
				"sub_button":[
					{
						"type":"click",
						"name":"点击试试",
						"key":"shanshan"
					},
					{
						"type":"location_select",
						"name":"发送位置",
						"key":"location4u"
					}
				]
			}
	]
};

var post_str = new Buffer(JSON.stringify(menu));

//将对access_token的操作写在回调函数里，这样可以保证文件的access_token在使用前已经从文件中读取
fs.readFile('token.txt',options,function (err,data) {
    if(!err){
        access_token = data;
        //根据这个post_options来访问微信官方api响应menu操作
        var post_options = {
            host: 'api.weixin.qq.com',
            port: '443',
            path: '/cgi-bin/menu/create?access_token=' + access_token,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': post_str.length
            }
        };
        var post_req = https.request(post_options, function (response) {
            var responseText = [];
            var size = 0;
            response.setEncoding('utf8');
            //每次接受到数据就会监听到'data'，然后进入该回调函数
            response.on('data', function (data) {
                responseText.push(data);          //把接受到的数据都存在responseText里
                size += data.length;
            });
            //当接受完数据后就会监听到'end'
            response.on('end', function () {
                console.log(responseText);
            });
        });
        post_req.write(post_str);
        post_req.end();
    }
});

