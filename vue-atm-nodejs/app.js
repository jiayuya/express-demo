var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var demoRouter = require('./routes/demo');

var app = express();
app.use(cookieParser('sessiontest'));
app.use(session({
  secret: 'sessiontest',
  resave: true,
  saveUninitialized: true
}));

app.use(function (req, res, next) {
  var url = req.url;
  var d = url.split("/")
  if (d[1] != 'demo') {
    next()
  } else {
    if (req.session.loginId) {
      next()
    } else {
      res.redirect("/")
    }
  }

})
// view engine setup
app.set('views', path.join('views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;