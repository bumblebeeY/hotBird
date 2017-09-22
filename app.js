var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var async = require('async');
// var multer = require('multer');

var routes = require('./routes/routes');

var app = express();
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
var ejs=require('ejs');
app.engine('html',ejs.__express);
app.set('view engine', 'html');
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


routes(app);


var server = http.createServer(app);
server.listen(port);

server.on('error', function (error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});
server.on('listening', function () {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
});

// //加载路由
// async.waterfall([
//     function (callback) {
//         routes(app);
//         callback(null);
//     },
//     function (callback) {
//         app.use(function (req, res, next) {
//             var err = new Error('Not Found');
//             err.status = 404;
//             next(err);
//         });
//         if (app.get('env') === 'development') {
//             app.use(function (err, req, res, next) {
//                 res.status(err.status || 500);
//                 res.render('error',{
//                     message:err.message,
//                     error:err
//                 });
//             })
//         }
//         app.use(function (err, req, res, next) {
//             res.status(err.status || 500);
//             res.render('error',{
//                 message:err.message,
//                 error:{}
//             });
//         })
//     }
// ],function () {
// });

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}