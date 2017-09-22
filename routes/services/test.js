/**
 * @author：龚意
 * @version：v0.0.1
 * 创建日期：2017/9/20
 * 历史修订：
 */
var test={
    init:function (app) {
        app.get('/', function(req, res, next) {
            res.render('index', { title: 'Express' });
        });
    }
};
module.exports=test;