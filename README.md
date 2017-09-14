# nodejs-mvc-framework 一个简单的nodejs mvc 框架

## 框架说明

这个框架的数据模型、控制器是分离的，因为框架开发目的是用于接口，不在于页面输出，所以没有做模板这块内容。有需要的可以自己加一下。

这个框架的核心就是利用了nodejs的模块化。

路由和输出使用的是`express`框架，比较方便一点，也可以用其他的代替

数据库采用的是mysql（mysql连接池）

## 使用到的模块

- `express`
- `mysql`
- `async`

## 使用方法

### 配置项

在`App/Conf/`目录下，默认有三个配置文件：

- `default.js` 默认的配置文件，所有的配置项都可以在这里写
- `db.js`  数据库连接信息配置
- `db.dev.js` 调试模式下的数据库连接信息配置

在`default.js`里，默认有一个`debugMode`配置，表示是否调试模式。如果是调试模式，会引用`db.dev.js`，非调试模式下，会引用`db.js`。你也可以用调试模式做更多的事情。

```
var config = {
	debugMode: true
	,dbMode: 'Mysql' // 数据库连接模式 目前只有Mysql，使用mysql的连接池处理
};
```

在`db.js`里，是mysql的数据库连接信息配置：

```
var db_config = {
	host: 'localhost', # 主机名
	user: 'root',      # mysql用户名
	password: '',      # mysql密码
	database: 'app',   # 数据库名
	port: '3306'       # 端口号
};
```

### 公共函数

默认在`App/Common/`文件夹里添加了一个`Function.js`文件，可以将一些共用的函数放置在这里。

### 控制器

控制器都在`App/Controller/`文件夹中，比如demo中的`UserController.js`。

首先引入需要的模块/包：

```
var express = require('express');
var router = express.Router();
var async = require('async');
```

再引入自定义的公共函数和数据模型：

```
var UserModel = require('../Model/UserModel');
var Common = require('../Common/Function');
```

关于数据模型，接下来会说明。

接下来要做的就是接收请求并处理、返回数据，demo中使用的是express框架的路由。

这里说明一下，路由可以是`/user/123`这样的，也可以是`/user?id=123`这样的，看项目的需求。

如果是`/user/balance/:id` 如：`/user/balance/23` 这样的url获取参数方法： `req.params.id`；
如果是`/user/balance?id=23` 这样的url获取参数方法： `req.query.id`

```
router.get('/balance/:id', function(req, res){
  var userid = parseInt(req.params.id);
  // do something
});
```

在nodejs中，比较麻烦的一点就是，很多函数和方法、模块都是异步执行的，用回调函数告诉你结果。这个特点很棒，但是也容易导致回调陷阱。

在这里，使用async的waterfall方法，让程序顺序执行（从代码看上去，实质还是异步的），可以避免回调陷阱。

关于async模块的使用方法，可以自行百度一下，教程挺多的。

```
async.waterfall([
    // 要顺序执行的方法列表在这里，用数组的形式
    // 这里的第一个方法是调用UserModel的getBalance方法，并将返回值回调给callback
    function(callback){
        UserModel.getBalance(userid, callback);
    },
    // 这里的balance参数就是上一步返回的数据
    function(balance, callback){
        console.log('success! balance: '+ balance);
        callback(null, balance);
    }
], function(err, balance) {
    // 在这个部分，可以处理错误和输出数据
    if(err){
        res.send( Common.output(10002, err.message) );
    }else{
        res.send( Common.output( {balance: balance} ) );
    }
});
```

在控制器的最后，需要将模块导出：

（项目的入口文件在`/index.js`，所以这里需要将控制器以模块的形式导出，在入口文件里再引入）

```
module.exports = router;
```

### 数据模型

在刚才的控制器中，有引入并使用到模型的方法，其实模型和控制器在写法上区别不大，只是各自执行的任务不同。

模型文件都在`/App/Model/`文件夹中，demo中有一个`UserModel.js`文件。

首先，也是引入必须的模块。这里不需要引入`express`了。

```
var async = require('async');
var Model = require('../../Core/Model');
```

其中Model是框架的核心文件，它封装了mysql执行的通用方法。

接下来，写一个简单的模块并导出：

```
var UserModel = {};

UserModel.getBalance = function(userid, callback){
  // do something
}
```

跟控制器一样，数据模型中，也使用async防止一直回调

```
async.waterfall([
  // 第一个执行方法
  function (cb){
    console.log('start mysql query');
    Model.query('select user_money from tp_users where user_id=?', [userid], cb);
  },
  // 第二个执行方法，其中results和fields参数是第一个执行方法cb回来的数据
  // 可以在这个方法中做输出数据的处理
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
  // 所有方法执行完，获取到数据之后，回调从控制器传递过来的callback函数，将数据传递回控制器
  console.log('mysql query error');
  callback(err, results);
});
```

同样的，数据模型也需要以模块的方式导出：

```
module.exports = UserModel;
```

### 入口文件

你会看到，这个路由的实际请求路径应该是`/user/balance/123`，但是怎么没有`user`？接着看。

入口文件是`/index.js`。

在入口文件引入模块之后，使用下面的代码将写好的控制器引入进来：

```
// 配置用户部分的路由
var UserController = require(APP_PATH+'/Controller/UserController');
app.use('/user', UserController);
```

利用`express`框架的路由功能，将user这整个的路由前缀都交给UserController，这样的话，在实际访问时，请求的完整路径就是`http://demo.com/user/balance/123`。

如果需要设定首页的接口，可以在入口文件中使用`express`的use方法：

```
app.get('/', function(req, res){
	res.send('Hello world');
});
```

当然，更好的方式是用控制器做，可以自行修改代码。

在入口文件中，还可以定义端口号，demo中使用的是8080端口

```
var server = app.listen(8080, function(){
	console.log('server start on http://localhost:8080');
})
```





