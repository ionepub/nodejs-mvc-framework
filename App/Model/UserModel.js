/**
 * 用户数据模型
 * 数据模型应该只能被控制器调用
 * 数据模型应该做好数据输出控制
 */

var async = require('async');
var Model = require('../../Core/Model');
var UserModel = {};

UserModel.getBalance = function(userid, callback){
	if(!userid){
		callback({message: '用户id非法'}, 0);
	}else{
		async.waterfall([
			function (cb){
				console.log('start mysql query');
				Model.query('select user_money from tp_users where user_id=?', [userid], cb);
			},
			function(results, fields, cb){
				console.log('mysql query callback triggered');
				console.log('results= ' + results);
				// 数据处理
				if(results.length == 1){
					// success
					results = results[0]['user_money'];
					cb(null, results);
				}else{
					// failed
					var err = new Error('查询失败或用户不存在');
					cb( err, 0 );
				}
			}
		], function(err, results){
			console.log('mysql query error');
			callback(err, results);
		});
	}
}

module.exports = UserModel;
