/**
 * Created by Neferpitou on 2017/5/4.
 */

var Waterline = require('waterline');
var mysqlAdapter = require('sails-mysql');
var mongoAdapter = require('sails-mongo');

// 适配器
var adapters = {
    mongo: mongoAdapter,
    mysql: mysqlAdapter,
    default: 'mongo'
};

// 连接
var connections = {
    mongo: {
        adapter: 'mongo',
        url: 'mongodb://localhost/mynode'
    },
    mysql: {
        adapter: 'mysql',
        url: 'mysql://root:64778098@localhost/mynode'
    }
};

// 数据集合
var User = Waterline.Collection.extend({
    identity: 'user',
    connection: 'mongo',
    schema: true,
    attributes: {
        name: {
            type: 'string',
            // 校验器
            required: true
        },
        passwd: {
            type: 'string',

            required:true
        }
        // submission_date: {
        //     type: 'date'
        // }
    },
    migrate: 'safe',
    autoPK: false,
    autoCreatedAt: false,
    autoUpdatedAt: false

    // 生命周期回调
    // beforeCreate: function(value, cb){
    //     value.submission_date = new Date();
    //     console.log('beforeCreate executed');
    //     return cb();
    // }
});

var orm = new Waterline();

// 加载数据集合
orm.loadCollection(User);

var config = {
    adapters: adapters,
    connections: connections
}

orm.initialize(config, function(err, models){
    if(err) {
        console.error('orm initialize failed.', err)
        return;
    }

    // console.log('models:', models);
    models.collections.user.create({name: 'nefer',passwd:'asdf'}, function(err, user){
        console.log('after user.create, err, user:', err, user);
    });
});
