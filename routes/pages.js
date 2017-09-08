var UserService = require('../services/user.js');
var ApiService = require('../services/api.js');
var Sitemap = require('express-sitemap');
var path = require('path');
var _ = require('underscore');
var config = require('../config/config.json');
var appConfig = require('../config/service.js');
var fs = require('fs');
var ejs = require('ejs');

module.exports = function(app) {

  app.get('/', function(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
    templatePath = "../../dist/";
    res.render(templatePath,{});
  });

  app.get('/sitemap.xml', function(req, res, next) {
    res.sendFile(path.resolve(__dirname + '/../sitemaps.xml'), function(err){
      if (err) {
          //res.send("<h1 style='color:orangered'>Out site is facing problems in fetching the Sitemaps. Apologies for the inconvenience.</h1>");
        console.log('SITEMAP-REQUEST-ERROR'+ err);
      }
      else
        console.log('SITEMAP-REQUEST-SUCCESS');
    });
  });

  app.get('/api/status', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({"status": 200});
  });
  
};