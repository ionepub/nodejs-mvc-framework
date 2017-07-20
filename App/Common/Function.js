/**
 * 公共函数
 */

var Common = {};

/**
 * 公共的API输出
 * 用法：
 *     失败： output( 1, '用户不存在' )
 *     成功：output( 0, {userid:1} )
 *     成功：output( {userid:1} )
 */
Common.output = function(code, message){
	var result = {};
	if( typeof code == 'number' && code != 0){
		// 失败
		result.code = code;
		result.message = (typeof message == 'string') ? message : '';
		result.data = {};
	}else if (typeof code == 'number' && code == 0) {
		// 成功
		result.code = 0;
		result.message = (typeof message == 'string') ? message : 'SUCCESS';
		result.data = (typeof message == 'object') ? message : {};
	}else if (typeof code == 'object') {
		result.code = 0;
		result.message = 'SUCCESS';
		result.data = code;
	}
	return result;
}

module.exports = Common;
