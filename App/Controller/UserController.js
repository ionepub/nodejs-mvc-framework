/**
 * 用户控制器
 * 所有的路由地址为：/user/xxx
 * 在所有的控制器中，应该做好输入数据的控制，避免非法输入
 */

var express = require('express');
var router = express.Router();
var async = require('async');

var UserModel = require('../Model/UserModel');
var Common = require('../Common/Function');

/**
 * 参数获取说明
 * /user/balance/:id 如：/user/balance/23 这样的url获取参数方法： req.params.id
 * /user/balance?id=23 这样的url获取参数方法： req.query.id
 */

// 获取用户余额
router.get('/balance/:id', function(req, res){
    // res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    // res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    var userid = parseInt(req.params.id);
    if(!userid || isNaN(userid) || userid <= 0){
        res.status(404).send( Common.output(10001, 'userid required') );
        return false;
    }

    // 使用async的waterfall方法，顺序执行，防止回调陷阱
    async.waterfall([
        function(callback){
            UserModel.getBalance(userid, callback);
        },
        function(balance, callback){
            console.log('success! balance: '+ balance);
            callback(null, balance);
        }
    ], function(err, balance) {
        if(err){
            res.send( Common.output(10002, err.message) );
        }else{
            console.log('sql result: =====> ');
            console.log(balance);
            res.send( Common.output( {balance: balance} ) );
        }
    });
});

module.exports = router;
