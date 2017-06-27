const log4js = require("log4js");

module.exports = { 
  of: function(s){
      return log4js.getLogger(s);
  }, 
  configure: function(cfg) {
      if (!cfg) cfg = {};
      log4js.clearAppenders();
      log4js.configure( cfg );
      log4js.setGlobalLogLevel( cfg.levels && cfg.levels["[all]"] || "INFO" );
      return this;
  }
};