const logger = require('../../lib/logger');

logger.of('foo').constructor.prototype.emit = function() {
    logger.events.push(arguments)
};

logger.events = [];

