/**
 * 基础数据模型
 * @package Core
 */


var config = require('../App/Conf/default');

var DB_MODE = config.dbMode;

var db = require('./'+DB_MODE + 'Model');

db.init(config.db);

var Model = {};

Model.query = function(sql, options, callback){
	db.query(sql, options, callback);
};

module.exports = Model;
