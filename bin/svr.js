const config  = require('config');
const logger  = require('../lib/logger').configure(config.logger)
const log     = logger.of('demo-svr');
const options = Object.assign({}, config, { logger });
const banners = require('../lib/banners');

log.info("\n%s", banners.header() )

require('../').start(options, (err, app) => {
    if (err)  {
        log.fatal("\n%s, Can't start server", banner.error(), err);
        return process.exit(1)
    }
    
    log.info("\n%s\n at port: %s", banners.started(), app.svr.address().port )

    process.on('SIGINT', () => terminate('SIGINT', app));
    process.on('SIGTERM',() => terminate('SIGTERM', app));
    process.on('uncaughtException', (err) => terminate(err, app));
    process.on('unhandledRejection', (err) => terminate(err, app));
    process.on('error', (err) => terminate(err, app));
})

function terminate(sig, app) {
    log.fatal('\n%s\n\nreason: ', banners[ sig instanceof Error ? 'error' : 'closing' ](), sig)
    app.stop( (err) => {
        log[err ? "error" : "info"]("shutdown ", err || "OK")
    })
}
