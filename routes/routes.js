/**
 * @author：龚意
 * @version：v0.0.1
 * 创建日期：2017/9/20
 * 历史修订：
 */
var fs = require('fs');
module.exports = function (app) {
    var FS_PATH_SERVICES = './routes/services/';
    var REQUIRE_PATH_SERVICE = './services/';
    fs.readdir(FS_PATH_SERVICES, function (err, list) {
        if (err) {
            throw '没有找到该文件夹，请检查......'
        }
        for (var e; list.length && (e = list.shift());) {
            var service = require(REQUIRE_PATH_SERVICE + e);
            service.init && service.init(app);
        }
    })
};