var fs = require('fs-extra');
var writeFileAtomic = require('write-file-atomic');


module.exports = function (session) {
    var Store = session.Store;
    
    function MyFileStore(catalog) {            //相当于构造函数
        var self = this;

        self.catalog = catalog + '/';

        fs.mkdirsSync(self.catalog);          //若输入的目录还未创建,则创建目录,以后后续函数成功打开路径

    }

    //MyFileStore为函数 , MyFileStore.prototype为该函数的原型（相当于类的感觉） , MyFileStore.prototype.__proto__为该函数原型的父类 , new MyFileStore 为用该函数原型创建的对象

    MyFileStore.prototype.__proto__ = Store.prototype;    //使MyFileStore的原型继承于 Store的原型


    //为 MyFileStore的原型添加 实现session store 要求为required的三个方法get , set ,destroy


    //为MyFileStore的原型添加get函数
    MyFileStore.prototype.get = function (sessionId, callback) {

        var sessionPath = this.catalog +sessionId+'.json';        //存储到指定目录下以Session ID为名的json文件中

        fs.readFile(sessionPath,'utf8',function (err,data) {

            if (!err) {       //若成功读取
                var json;
                try {
                    json = JSON.parse(data);          //将读到的字符串解析成json对象
                } catch (parseError) {
                    return fs.remove(sessionPath, function (removeError) {
                        if (removeError) {
                            return callback(removeError);
                        }
                        callback(parseError);
                    });
                }
                if (!err) {
                    return callback(null, !session ? null : json);
                }
            }else{          //若读取失败
                console.log('get时出错 , '+err);
                callback(err);
            }

        });
    };


    MyFileStore.prototype.set = function (sessionId,session,callback) {
        try {
            session.__lastAccess = new Date().getTime();        //设置__lastAccess 为最后一次存储session的时间

            var sessionPath = this.catalog +sessionId+'.json';

            var json = JSON.stringify(session);               //将json格式的session解析成字符串

            writeFileAtomic(sessionPath, json, function (err) {

                if (callback) {
                    err ? callback(err) : callback(null, session);
                }
            });
        } catch (err) {
            console.log('set时出错 , '+err);
            if (callback) callback(err);
        }

    };

    MyFileStore.prototype.destroy = function (sessionId,callback) {

        var sessionPath = this.catalog +sessionId+'.json';
        fs.remove(sessionPath, callback);
    };


    return MyFileStore;             //返回MyFileStore 用于 new 出对象
};