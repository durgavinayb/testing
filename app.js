var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var requireFu = require('require-fu');
var RedisStore = require('connect-redis')(session);
var appConfig = require('./config/service.js');
var FileStreamRotator = require('file-stream-rotator');
var fs = require('fs');
var app = express();
app.set('trust proxy', 1);

/* -----------------------Logging Confirguration ------------------- */

var logDirectory = __dirname + '/log'

// Check whether log directory exists - if not then create
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

var accessLogStream = FileStreamRotator.getStream({
    filename: logDirectory + '/access-%DATE%.log',
    frequency: 'daily',
    date_format: "YYYY-MM-DD",
    verbose: true
});

if (!appConfig.getProperty("minify")) {
    app.use(logger(':date[web]   :method   :url    :response-time',{stream: accessLogStream}));
}

app.locals.deployVersion    = (new Date).getTime();
app.locals.isProd           = appConfig.getProperty("minify");
app.locals.staticRoot       = appConfig.getProperty("static_root");
app.locals.pagesPath        = '/pages';

var thirtyDay = 30 * 86400000;

app.use(session({
    store: new RedisStore({
        host: appConfig.getProperty('redis_url'),
        port: appConfig.getProperty('redis_port'), prefix: 'test-sess',
        ttl: 30*86400
    }),
    cookie: {domain: appConfig.getProperty('server_domain'), expires: new Date(Date.now() + thirtyDay)},
    secret: 'testSecret',
    resave: false,
    saveUninitialized: true,
    name: 'test-session',
    rolling: true
}));

// view engine setup
app.set('views', path.join(__dirname, '/public/pages'));
app.set('view engine', 'ejs');

app.use(bodyParser.json({limit: '50mb', parameterLimit: 10000000}));
app.use(bodyParser.urlencoded({
  extended: true, limit: '50mb', parameterLimit: 10000000
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), {maxAge: thirtyDay}));
app.use("/dist", express.static(__dirname +'/dist/'));

requireFu(__dirname + '/routes')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {

  if(req.url && req.url.indexOf('/api/')>-1 || req.url.indexOf('-min.map') > -1 || req.url.indexOf('js.map') > -1){
    console.log('Unknown api called : '+ req.url);
    res.status(500);
    res.send();
  }
  else{
    res.status(404);
    res.render("dist/");
  }

});

app.use(function (err, req, res, next) {

    res.status(err.status || 500);

    if(req.url && req.url.indexOf('/api/')){
      res.render("dist/");
      res.send();
    }
    else {
      res.render("dist/");
    }
});

module.exports = app;