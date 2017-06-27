const redis = require('redis')

module.exports = {
  init
}

function init({redis:dbCfg, logger}, done) {
    const log = logger.of('init');
    
    log.debug('initiating redis db');
    const client = 
      redis.createClient(dbCfg)
        .on('ready', () => { 
            log.info('connected to db'); 
            done(null, client) 
         })
        .on('error', done)
}