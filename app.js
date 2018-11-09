var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
var mongoose = require('mongoose');
var errorHandler = require('errorhandler')
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var okta = require("@okta/okta-sdk-nodejs");
var ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;

var publicRouter = require('./routes/public');
var dashboardRouter = require('./routes/dashboard');
const usersRouter = require("./routes/users");

var app = express();

var oktaClient = new okta.Client({
  orgUrl: 'https://dev-310068.oktapreview.com',
  token: '00bJYd0L3NzL4txuaD70VRA-FPr-QwxWiiNz2I3090'
});

const oidc = new ExpressOIDC({
  issuer: "https://dev-310068.oktapreview.com/oauth2/default",
  client_id: '0oah94rgl2BfrVS4e0h7',
  client_secret: 'bMglTnK7d8Lyj3iAHS0pRiUO0y-rBiwXA6J4W8oR',
  redirect_uri: 'http://localhost:3000/users/callback',
  scope: "openid profile",
  routes: {
    login: {
      path: "/users/login"
    },
    callback: {
      path: "/users/callback",
      defaultRedirect: "/"
    }
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', publicRouter);
app.use('/dashboard', dashboardRouter);
app.use('/users', usersRouter);

app.use(session({
  secret: '7b23f897hy34ybrrxiuhbfdrfgs',
  resave: true,
  saveUnitialized: false
}));
app.use(oidc.router);

app.use((req, res, next) => {
  if (!req.userinfo) {
    return next();
  }

  oktaClient.getUser(req.userinfo.sub)
    .then(user => {
      req.user = user;
      res.locals.user = user;
      next();
    }).catch(err => {
      next(err);
    });
});

function loginRequired(req, res, next) {
  if (!req.user) {
    return res.status(401).render("unauthenticated");
  }
  next();
}

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


