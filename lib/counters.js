const express = require('express');


module.exports = {
  init
}

function init(options, done) {
    const router = express.Router();
    const log    = options.logger.of('counters');

    router.get('/:name', (q,r) => {
        const app  = r.app;
        const db   = app.get('db');
        const name = q.params.name;
        
        log.debug('getting counter for [%s]', name);
        
        db.get(name, (err, count) => {
            if (err) {
                log.error('failed to get counter for [%s]', name);
                r.json({ message: err.message });
                return
            }
            
            if (!count) count = 0;
            
            log.info('returning counter %s:%s', name, count);
            r.json({ name, count })
        })
    })
    
    router.post('/:name', (q,r) => {
        const app = r.app;
        const db = app.get('db');
        const name = q.params.name;
        
        log.debug('getting counter for [%s]', name);
       
        db.incr(name, (err, count) => {
            if (err) {
                log.error('failed to increment counter for [%s]', name);
                r.json({ message: err.message });
                return
            }
            
            log.info('returning counter %s:%s', name, count);
            r.json({ name, count })
        })
    })
    
    router.post('/:name/:by', (q,r) => {
        const app  = r.app;
        const db   = app.get('db');
        const name = q.params.name;
        const by   = q.params.by;
        
        log.debug('incrementing counter for [%s] by [%s]', name, by);
        
        db.incr(name, (err, count) => {
            if (err) {
                log.error('failed to increment counter for [%s] by [%s]', name, by);
                r.json({ message: err.message });
                return
            }
            
            log.info('returning counter %s:%s', name, count);
            r.json({ name, count })
        })
    })
    
    router.delete('/:name', (q,r) => {
        const app  = r.app;
        const db   = app.get('db');
        const name = q.params.name;
        
        log.debug('removing counter: [%s]', name);
        
        db.del(name, (err, removed) => {
            if (err) {
                log.error('failed to remove counter [%s]', name);
                r.json({ message: err.message });
                return
            }
            
            log.info(removed ? 'key %s removed' : 'key %s was not present', name);
            r.json({ name, removed: true })
        })    
    })
    
    options.logger.of('init').info('counters router constructed');
    
    done(null, router)
}