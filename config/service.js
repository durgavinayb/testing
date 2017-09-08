var env 	   = process.env.NODE_ENV || "development";
var config 	 = require(__dirname + '/../config/config.json')[env];

module.exports = new function(){
    this.getProperty = function(key){
        return config[key];
    };
};
