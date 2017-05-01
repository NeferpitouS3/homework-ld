/**
 * Created by Neferpitou on 2017/3/21.
 */
var http = require('http');
var url = require('url');
var NEWS ={
    1: '第一篇新闻的内容',
    2: '第二篇新闻的内容',
    3: '第三篇新闻的内容'
};
function getNews(id) {
    return NEWS[id] || '文章不存在';
}
var server = http.createServer(function (req,res) {

    function send(html) {
        res.writeHead(200,{
            'content-type':'text/html;charset=utf-8'
        });
        res.end(html);
    }
    var info = url.parse(req.url,true);        //这个true参数使得info的query经过querystring处理，返回的是一个json对象
    req.pathname = info.pathname;              //网络地址后的目录，根目录为'/'
    req.query=info.query;

    if(req.url === '/'){
        send('<ul>'+
                '<li><a href="/news?type=1&id=1">新闻一</a></li>'+
                '<li><a href="/news?type=1&id=2">新闻二</a></li>'+
                '<li><a href="/news?type=1&id=3">新闻三</a></li>'+
            '</ul>'
        );
    }else if(req.pathname ==='/news' && req.query.type === '1'){
        send(getNews(req.query.id));
    }else{
        send('<h1>新闻不存在!</h1>');
    }
});
server.listen(3000);