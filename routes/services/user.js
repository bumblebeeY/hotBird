/**
 * @author：龚意
 * @version：v0.0.1
 * 创建日期：2017/9/20
 * 历史修订：
 */
var fs = require('fs');
var util = require('./../util');
var USER_PATH = './database/user.json';
var User = {
    init: function (app) {
        app.post('/user/get', this.getUser);
        app.post('/user/create', this.addUser);
        app.post('/user/login', this.login);
        app.post('/user/login/token', this.loginByToken);
        app.post('/user/password/update', this.updatePassword);
        app.post('/user/delete', this.deleteUser);
    },
    //获取用户信息
    getUser: function (req, res) {
        var key = req.body.key;
        var partment = req.body.partment;
        if (key !== util.getKey()) {
            return res.send({
                status: 0,
                data: '使用了没有鉴权的key'
            })
        }
        fs.readFile(USER_PATH, function (err, data) {
            if (!err) {
                try {
                    var obj = JSON.parse(data);
                    var newObj = [];
                    for (var i in obj) {
                        if (obj[i].partment === partment) {
                            delete obj[i]['password'];
                            newObj.push(obj[i]);
                        }
                    }
                    return res.send({
                        status: 0,
                        data: newObj
                    })
                } catch (e) {
                    return res.send({
                        status: 0,
                        err: e
                    })
                }
            }
        })
    },
    //新增用户
    addUser: function (req, res) {
        var username = req.body.username;
        var password = util.md5(req.body.password);
        var tel =req.body.tel;
        var email =req.body.email;
        var partment=req.body.partment;
        var tag = req.body.tag;
        var creater = req.body.creater || ' ';
        if (!username || !password || !tel || !email || !tag || !creater) {
            return res.send({
                status: 0,
                data: '缺少必要的参数'
            })
        }
        try {
            var content = JSON.parse(fs.readFileSync(USER_PATH));
            var obj = {
                'userid': util.guid(),
                'username': username,
                'password': password,
                'tel': tel,
                'email': email,
                'tag': tag,
                'partment':partment,
                'creater': creater,
                'time': new Date(),
                'token': ''
            };
            content.push(obj);
            fs.writeFileSync(USER_PATH, JSON.stringify(content));
            delete obj.password;
            return res.send({
                status: 1,
                data: obj
            })
        } catch (e) {
            return res.send({
                status: 0,
                err: e
            })
        }
    },
    //用户登录
    login: function (req, res) {
        var email = req.body.email;
        var password = util.md5(req.body.password);
        var deviceId = req.body.deviceId;
        var token = util.guid() + deviceId;
        var content = JSON.parse(fs.readFileSync(USER_PATH).toString());
        for (var i in content) {
            //验证通过
            if (content[i].email === email && content[i].password === password) {
                content[i]['token'] = token;
                console.log(content[i]);
                fs.writeFileSync(USER_PATH, JSON.stringify(content));
                delete content[i].password;
                return res.send({
                    status: 1,
                    data: content[i]
                })
            }
        }
        return res.send({
            status: 0,
            data: '用户名或者密码错误'
        })
    },
    loginByToken: function (req, res) {
        var token = req.body.token;
        var content = JSON.parse(fs.readFileSync(USER_PATH));
        for (var i in content) {
            if (token === content[i].token) {
                delete content[i].password;
                return res.send({
                    status: 1,
                    data: content[i]
                })
            }
        }
        return res.send({
            status: 0,
            info: 'token失效'
        })
    },
    updatePassword: function (req, res) {
        var token = req.body.token;
        var oldPassword = util.md5(req.body.oldPassword);
        var password = util.md5(req.body.password);
        var content = JSON.parse(fs.readFileSync(USER_PATH));
        for (var i in content) {
            if (token === content[i].token && oldPassword === content[i].password) {
                content[i].password = password;
                fs.writeFileSync(USER_PATH, JSON.stringify(content));
                return res.send({
                    status: 1,
                    data: '更新成功'
                })
            }
        }
        return res.send({
            status: 0,
            data: '更新失败！没有找到该用户或者初始密码错误！'
        })
    },
    deleteUser: function (req, res) {
        var token = req.body.token;
        var email =req.body.email;
        var content = JSON.parse(fs.readFileSync(USER_PATH));
        for(var i in content){
            if(token===content[i].token){
                for(var j in content){
                    if(content[j].email===email){
                        content.splice(j,1);
                        fs.writeFileSync(USER_PATH,JSON.stringify(content));
                        return res.send({
                            status:1,
                            info:content,
                            data:'删除成功'
                        })
                    }
                }
            }
        }
        return res.send({
            status:0,
            data:'删除失败！没有找到该用户或者用户鉴权失败'
        })
    }
};
module.exports=User;
