var createError = require('http-errors');
var express = require('express');
    hbs = require('hbs');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var logger = require('morgan');

var bodyParser = require('body-parser');

var mysql      = require('mysql');


var pool  = mysql.createPool({
    connectionLimit : 10,
    host     : '127.0.0.1',
    user     : 'IMSclient',
    password : '1234',
    database : 'inventoryms'
});


var indexRouter = require('./routes/login/index');
var registerRouter = require('./routes/login/register');
var userRouter = require('./routes/login/users');
var dashboardRouter = require('./routes/dashboard');
var noticeRouter = require('./routes/controller/notice');
var labRouter = require('./routes/controller/lab');
var inventoryRouter = require('./routes/controller/inventory');
var practicalRouter = require('./routes/controller/practical');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.set('pool',pool);

var sessionChecker =function (req,res) {
    if (!req.session.user) {
        res.redirect('/');
        return;
    }
    return req.session.role;
};

app.set('sessionChecker',sessionChecker);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
    session({secret : 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD',
        resave: false,
        saveUninitialized: true}));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));





app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/users',userRouter);
app.use('/dashboard',dashboardRouter);
app.use('/notice',noticeRouter);
app.use('/lab',labRouter);
app.use('/inventory',inventoryRouter);
app.use('/practical',practicalRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
