
var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: '64778098',
    database: 'mynode'
});

function startQuery(){
    pool.getConnection(function (err, connection) {
        if (err) throw err;

        var value = 'ha';
        var query = connection.query('SELECT * FROM user WHERE name=?', value, function (err, ret) {
            if (err) throw err;

            console.log(ret);
            setTimeout(function () {
                connection.release();         //1秒后释放连接
            }, 1000);
        });
        console.log(query.sql);
    });
}

for (var i = 0; i < 10; i++) {
    startQuery();
}

/*
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '64778098',
    database: 'mynode'
});

connection.connect(function (err) {
    if (err) throw err;

    var value = 'ha';
    var query =  connection.query('SELECT * FROM user where name=?',value,function (err, ret) {    //防止sql注入
        if (err) throw err;

        console.log(ret);
        connection.end();
    });

    console.log(query.sql);      //打印出该条sql语句,该语句先执行
});
*/