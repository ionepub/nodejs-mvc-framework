/**
 * Mysql数据连接基础操作
 * @package Core
 */

var mysql = require('mysql');

var MysqlModel = {};

MysqlModel.pool = null;

MysqlModel.init = function(DB_CONFIG){
	if(typeof DB_CONFIG == 'undefined' || !DB_CONFIG){
		throw new Error('db config required');
	}
	console.log('database inited');
	MysqlModel.pool  = mysql.createPool(DB_CONFIG);
};

MysqlModel.query = function(sql, options, callback){
	if(!MysqlModel.pool){
		callback({message:'Please init model first.'}, null, null);
		return false;
	}
	MysqlModel.pool.getConnection(function(err, connection) {
		if(err){
			callback(err, null, null);
		}else{
			connection.query(sql,options,function(err,results,fields){
				connection.release();
				callback(err,results,fields);
			});
		}
	});
};

module.exports = MysqlModel;
