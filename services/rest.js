var http    = require("http");
var https   = require("https");
var _       = require("underscore");

_.deepObjectExtend = function(target, source) {
    if(source){
      for (var prop in source){
        if(target){
          if(prop in target){
            _.deepObjectExtend(target[prop], source[prop]);
          }
          else{
            target[prop] = source[prop];
          }
        }
      }
    }

    return target;
};

module.exports = new function(){
  this.getJSON = function(options, onResult){

      options = options || {};

      options.method = 'GET';
      options.headers = options.headers || {};
    _.extend(options.headers,{
        'fm_cl': 'WEBSITE',
        'fm_cl_v': 2.3
      });

      var prot = options.port == 443 ? https : http;
      var req = prot.request(options, function(res){
          var output = '';
          console.log(new Date()+' ### ' +''+options.path+ ':' + res.statusCode);
          res.setEncoding('utf8');

          res.on('data', function (chunk) {
              output += chunk;
          });

          res.on('end', function() {
              try{
                var obj = _.isEmpty(output) ? {} : JSON.parse(output);
              }
              catch(e){
                console.log(new Date()+' ### ERROR PARSING RESPONSE: ' + ''+options.path+ ':' + res.statusCode);
                onResult(500,null);
                return;
              }
              onResult(res.statusCode, obj);
          });
      });

      req.on('error', function(err) {
          //res.send('error: ' + err.message);
      });

      req.end();
  };

  this.postJSON = function(options, data, onResult){

    options = options || {};

    options.method = 'POST';

    options.headers = options.headers || {};
    _.extend(options.headers, {
      'Content-Type': 'application/json',
      'fm_cl_v': 2.3
    });
    if(!options.headers.fm_cl){
      options.headers.fm_cl = "WEBSITE";
    }

      var prot = options.port == 443 ? https : http;
      var req = prot.request(options, function(res){
          var output = '';
          console.log(new Date()+' ### ' +''+options.path+ ':' + res.statusCode);
          res.setEncoding('utf8');

          res.on('data', function (chunk) {
              output += chunk;
          });

          res.on('end', function() {
                try{
                  var obj = _.isEmpty(output) ? {} : JSON.parse(output);
                }
                catch(e){
                  console.log(new Date()+' ### ERROR PARSING RESPONSE: ' + ''+options.path+ ':' + res.statusCode);
                  onResult(500,null);
                  return;
                }
              onResult(res.statusCode, obj);
          });
      });

      req.on('error', function(err) {
          console.log('error: ' + err.message);
      });

      req.write(JSON.stringify(data));
      req.end();
  };
  this.putJSON = function(options, data, onResult){

    options.method  = "PUT";
    options.headers = {
      'Content-Type': 'application/json',
      'fm_cl': 'WEBSITE',
      'fm_cl_v': 2.3
    };
    if(data.accessToken){
      options.headers['X-Auth-Token'] = data.accessToken;
    }
    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, function(res)
    {
      var output = '';
      res.setEncoding('utf8');

      res.on('data', function (chunk) {
        output += chunk;
      });

      res.on('end', function() {
        try{
          var obj = _.isEmpty(output) ? {} : JSON.parse(output);
        }
        catch(e){
          console.log(new Date()+' ### ERROR PARSING RESPONSE: ' + ''+options.path+ ':' + res.statusCode);
          onResult(500,null);
          return;
        }
        onResult(res.statusCode, obj);
      });
    });

    req.on('error', function(err) {
      console.log('error: ' + err.message);
    });

    req.write(JSON.stringify(data));
    req.end();
  };
};
