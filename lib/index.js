const async  = require('async');
const svr    = require('./webapp');
const dbDal  = require('./db');
const cntrs  = require('./counters');
const assign = Object.assign;

module.exports = {
  start
};

function start({web,db,counters,logger}, done) {
    const cfg = (obj) => assign({}, obj, {logger});
    const log = logger.of('init');
    
    log.info('starting init');
    log.debug('got options', {web, db, counters});
    
    async.parallel({
      app:      (next) => svr.init(cfg(web) , next),
      db:       (next) => dbDal.init(cfg(db), next),
      counters: (next) => cntrs.init(cfg(counters), next)
    }, function(err, res) {
        if (err) return done(err);
        
        dependenciesReady(res);
    });

    function dependenciesReady({app, db, counters}) {
        log.debug('dependencies ready!');
        
        app.set('db', db);
        
        log.debug('mounting routes');
        app.use('/api', counters);
        
        log.debug('starting server')

        app.start((err) => done(err, app))
    }
}