const async      = require('async');
const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');

module.exports = {
  init
}

function init(options, done) {
    const app = express();
    const log = options.logger.of('webapp');
    
    app.use(cors(options.cors));
    app.use(bodyParser.json());
    app.use(bodyParser.text());
    app.use(bodyParser.urlencoded({extended: false}));

    
    
    app.start = (done) => {
        if (app.svr) return done();
        
        app.use( (err, q, r, next) => {
            log.fatal('got error!', err);
            
            r.json({message: 'fatal error'});
            process.emit('error', err)
        });
        
        app.svr = app.listen( options.port, done )
    }
    
    app.stop = (done) => {
        log.warn('stopping server');
        async.parallel( [
          (next) => app.svr.close(next),
          (next) => app.get('db').quit(next)
        ], (err) => {
            delete app.svr;
            done(err)
        })
    }
    
    options.logger.of('init').info('webapp constructed');
    done(null, app);
}