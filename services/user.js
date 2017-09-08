var ApiService  = require('../services/api.js');
var url         = require('url');
var _           = require('underscore');
var async       = require('async');

module.exports = new function() {

  var self = this;
  this.socialAuth = function(req,callback) {
    ApiService.socialAuth(req.body,req.params.type,function(statusCode, data) {
      if (statusCode == 200){
        if(req.session) {
          req.session.user = data;
        }
      }
      callback(statusCode, data);
    });
  };

  this.register = function(req, callback) {
    ApiService.register(req.body, function(statusCode, data) {
        if (statusCode == 200 || statusCode == 201){
          if(req.session) {
            req.session.user = data;
          }
        }
      callback(statusCode, data);
    });
  };

  this.login = function(req, callback) {
    ApiService.login(req.body, function(statusCode, data) {
      var formattedUser = {};
      if (statusCode == 200){
        if(req.session) {
          req.session.user = formattedUser;
        }
        callback(statusCode, formattedUser);
      }else{
        callback(statusCode, data);
      }
    });
  };

  this.get = function(req, callback) {
    if(req.session){
      callback(req.session.user || {});
    }else{
      callback({});
    }
  };

  this.logout = function(req,callback){
    req.session.user = {};
    callback();
  };
};
