'use strict';
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var priceRouter = require('./routes/price');

class AppController {
  constructor() {
    this.express = express();
    this.setup();
    this.middlewares();
    this.routes();
    this.errorHandling();
  }

  setup() {
    // view engine setup
    this.express.set('views', path.join(__dirname, 'views'));
    this.express.set('view engine', 'jade');
  }

  middlewares() {
    this.express.use(logger('dev'));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(cookieParser());
    this.express.use(express.static(path.join(__dirname, 'public')));

    this.express.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      );
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      );
      next();
    });
  }

  routes() {
    const home = path.join(__dirname, '/../dist/interface');
    this.express.use('/', express.static(home));
    this.express.use('/price', priceRouter);
  }

  errorHandling() {
    // catch 404 and forward to error handler
    this.express.use(function(req, res, next) {
      next(createError(404));
    });

    // error handler
    this.express.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
  }

}

module.exports = new AppController().express;
