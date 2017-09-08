var rest 				= require('../services/rest.js');
var request 			= require('request');
var appConfig 			= require('../config/service.js');
var _ 					= require('underscore');

var restOptions = {
	host: appConfig.getProperty('buyer_service_url'),
	port: appConfig.getProperty('buyer_service_port')
};

module.exports = new function(){

	this.register = function(data,callback){
		restOptions.path = '/api/users/';
	    rest.postJSON(_.clone(restOptions),data, function (statusCode, result) {
	    	callback(statusCode, result);
	    });
	};

	this.socialAuth = function(data,type,callback){
		restOptions.path = '/api/users/authenticate/'+type;
		rest.postJSON(_.clone(restOptions),data, function (statusCode, result) {
			callback(statusCode, result);
		});
	};

	this.login = function(data,callback){
		restOptions.path 	= '/api/users/authenticate';
	    rest.postJSON(_.clone(restOptions),data, function (statusCode, result) {
			callback(statusCode, result);
	    });
	};
};