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

var homeRouter = require('./routes/home');
var storeRouter = require('./routes/store');
var cartRouter = require('./routes/cart');
var usersRouter = require("./routes/users");


var urlencodedParser= bodyParser.urlencoded({extended: false});
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});


var app = express();

var oktaClient = new okta.Client({
  orgUrl: 'https://dev-310068.oktapreview.com',
  token: '00bJYd0L3NzL4txuaD70VRA-FPr-QwxWiiNz2I3090'
});

const oidc = new ExpressOIDC({
  issuer: "https://dev-310068.oktapreview.com/oauth2/default",
  client_id: '0oah94rgl2BfrVS4e0h7',
  client_secret: 'bMglTnK7d8Lyj3iAHS0pRiUO0y-rBiwXA6J4W8oR',
  redirect_uri: 'https://fathomless-tor-48342.herokuapp.com/users/callback',
  scope: "openid profile",
  routes: {
    login: {
      path: "/users/login"
    },
    callback: {
      path: "/users/callback",
      defaultRedirect: "/store"
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

app.use('/', homeRouter);
app.use('/store', storeRouter);
app.use('/users', usersRouter);
app.use('/cart', loginRequired, cartRouter);

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

function isLoggedIn(req, res, next){
  if(!req.user){
    return 0;
  }
  else{
    return 1;
  }
}


 //*******Andy DB******GET REQUEST*********************/
app.get('/api/products', async (req, res) => {
  try {
    const client = await pool.connect()
    var result = await client.query('SELECT * FROM cart_table;');

    if (!result) {
      return res.send('No data found');
      }else{
      result.rows.forEach(row=>{
      console.log(row);
      });
      }

  res.send(result.rows);
  client.release();

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});


//******Andy DB*****POST Request*************/
app.post('/api/products',urlencodedParser, async (req,res)=>{
  try {
    const client = await pool.connect();

    var result = await client.query('insert into cart_table values ('+req.body.cart_id+', '+req.body.item_id+', '+req.body.item_quantity+');' );
    if (!result) {
         return res.send("POST Failure");
       } else {
         console.log("successful");
       }
       res.send(result.rows);
       client.release();
     } catch (err) {
       console.error(err);
       res.send("Error " + err);
  }
 });






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
