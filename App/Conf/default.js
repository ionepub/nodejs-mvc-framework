/**
 * 公共配置文件
 */

var config = {
	debugMode: true
	,dbMode: 'Mysql' // 数据库连接模式 目前只有Mysql，使用mysql的连接池处理
};

if(config.debugMode == true){
	var db_config = require('./db.dev'); // 开发环境下的数据库连接信息
}else{
	var db_config = require('./db'); // 运行环境下的数据库连接信息
}

config.db = db_config;

module.exports = config;
