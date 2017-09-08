var UserService = require('../../services/user.js');

function endsWith(str, suffix) {
  if (str == null) return true;
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

module.exports = function(app) {

  var prefix = "/api/users";

  app.post(prefix+'/resetPassword', function(req, res) {
    UserService.resetPassword(req,function(statusCode,data){
      res.statusCode = statusCode;
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data));
    });
  });

  app.post(prefix + '/register', function(req, res) {
    UserService.register(req, function(statusCode, data) {
      res.status(statusCode);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data));
    });
  });

  app.post(prefix + '/login', function(req, res) {
    UserService.login(req, function(statusCode, data) {
      res.status(statusCode);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data));
    });
  });

  app.post(prefix + '/authenticate/:type', function(req, res) {
    UserService.socialAuth(req, function(statusCode, data) {
      res.status(statusCode);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data));
    });
  });

  app.get(prefix, function(req, res) {
    UserService.get(req, function(data) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data));
    });
  });

  app.post(prefix + '/update', function(req, res) {
    UserService.updateUserInfo(req, function(statusCode, data) {
      res.status(statusCode);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data));
    });
  });

};
