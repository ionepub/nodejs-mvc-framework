/**
 * 项目入口文件
 * 运行：node index
 */

var express = require('express');
var app = express();

var APP_PATH = './App',
	CORE_PATH = './Core';

var config = require(APP_PATH+'/Conf/default');
var Common = require(APP_PATH+'/Common/Function');

// 配置用户部分的路由
var UserController = require(APP_PATH+'/Controller/UserController');
app.use('/user', UserController);

app.get('/', function(req, res){
	res.send('Hello world');
});

var server = app.listen(8080, function(){

	console.log('server start on http://localhost:8080');

})
